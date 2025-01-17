import mlflow
import mlflow.keras
import numpy as np
import pandas as pd
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
from keras.callbacks import Callback
import yfinance as yf
import datetime as dt
from mlflow.models.signature import infer_signature

# Set the tracking URI to the MLflow server
mlflow.set_tracking_uri("http://localhost:5000")

stock = "POWERGRID.NS"

def load_data(name_stock):
    stock = name_stock
    start = dt.datetime(2000, 1, 1)
    end = dt.datetime(2024, 11, 1)

    return yf.download(stock, start, end)

# Prepare data for LSTM
def prepare_data(data, look_back=60):
    data_training = pd.DataFrame(data['Close'][0:int(len(data)*0.70)])
    data_testing = pd.DataFrame(data['Close'][int(len(data)*0.70): int(len(data))])

    scaler = MinMaxScaler(feature_range=(0, 1))
    data_training_array = scaler.fit_transform(data_training)
    x_train = []
    y_train = []

    for i in range(100, data_training_array.shape[0]):
        x_train.append(data_training_array[i-100:i])
        y_train.append(data_training_array[i, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
    return x_train, y_train, scaler

# Define the LSTM model
def build_lstm_model(x_train):
    model = Sequential()

    model.add(LSTM(units=50, activation='relu', return_sequences=True, input_shape=(x_train.shape[1], 1)))
    model.add(Dropout(0.2))

    model.add(LSTM(units=60, activation='relu', return_sequences=True))
    model.add(Dropout(0.3))

    model.add(LSTM(units=80, activation='relu', return_sequences=True))
    model.add(Dropout(0.4))

    model.add(LSTM(units=120, activation='relu'))
    model.add(Dropout(0.5))

    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

# MLflow callback to log metrics after each epoch
class MLflowLoggingCallback(Callback):
    def on_epoch_end(self, epoch, logs=None):
        if logs:
            mlflow.log_metric("train_loss", logs["loss"], step=epoch)

# Main training and versioning script
def train_and_version_model():
    try:
        # Load and prepare data
        data = load_data(stock)
        X, y, scaler = prepare_data(data)

        # Start MLflow run
        with mlflow.start_run(nested=True):
            # Log parameters
            mlflow.log_param("epochs", 10)
            mlflow.log_param("batch_size", 32)
            mlflow.log_param("look_back", 60)

            # Build and compile the LSTM model
            model = build_lstm_model(X)

            # Train the model
            history = model.fit(
                X, y,
                batch_size=32,
                epochs=10,
                callbacks=[MLflowLoggingCallback()]
            )

            # Log metrics
            train_loss = history.history["loss"][-1]
            mlflow.log_metric("final_train_loss", train_loss)

            # Log the model with signature and input example
            input_example = X[:1].tolist()  # Convert NumPy array to list
            signature = infer_signature(X[:10], model.predict(X[:10]))
            mlflow.keras.log_model(
                model,  # The Keras model
                "lstm_stock_model",  # artifact_path (positional argument)
                signature=signature,  # Optional: Model signature
          # Optional: Input example
            )

            # Tag the run
            mlflow.set_tag("model_type", "LSTM")
            mlflow.set_tag("application", "Stock Market Prediction")

            # Register the model in MLflow Model Registry
            model_uri = f"runs:/{mlflow.active_run().info.run_id}/lstm_stock_model"
            mlflow.register_model(model_uri, "StockPredictionModel")

            print(f"______________________________-Model trained and logged. Model URI: {model_uri}")

    except Exception as e:
        print(f"An error occurred: {e}")

# Run the training and versioning
if __name__ == "__main__":
    train_and_version_model()