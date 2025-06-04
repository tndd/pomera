FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install --upgrade pip
RUN pip install pandas requests matplotlib

CMD ["python", "main.py"]