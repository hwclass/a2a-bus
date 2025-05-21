FROM golang:1.22
WORKDIR /app
COPY . .
ENV GOTOOLCHAIN=auto
RUN go mod init a2a-agent || true
RUN go mod tidy
CMD ["go", "run", "subscriber.go"]