FROM python:2.7
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENV DB_USER=consensys
ENV DB_PW=consensys
ENV DB_HOST=db
ENV DB_NAME=reservationmanager
ENTRYPOINT ["python"]
CMD ["app.py"]
