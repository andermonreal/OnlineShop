# OnlineShop

This is a project based on an Online Shop with simulated items, I use the following technologies for this project:
    - Database: PostgreSQL
    - Backend: Java and Jakarta EE 10.
    - Frontend: REACT.


## Deployment

### Database

1. Run the **Postgres database container**, in `backend/docker-compose.yaml` with the following command `docker compose up --build -d`.

### Backend

1. The backend is prepared to run in a **Payara Server**. I personaly download Payaa 6.2025.3 from NetBeans. 
Once downloaded go to the Payara's folder, run `./bin/asabin start-domain` and go to the Payara Console on "http://localhost:4848".

2. Create the **Connection Pool** of postgres with the following properties:
    - URL: jdbc:postgresql://localhost:5432/pscShop
    - serverName: localhost
    - databaseName: pscShop ("Docker configured")
    - user: ander ("Docker configured")
    - password: ander123 ("Docker configured")

3. Create the **Connection Resource** with the name of `jdbc/postgres`.

4. Go to the `./backend` folder and run `mvn clean package cargo:run` for creating a '.war' on `./backend/target/`-

5. Create the **Aplication on the Payara Console** with the default path `onlineShop` and upload the previous '.war' file generated.

6. Your backend will be served on "http://localhost:8080/onlineShop".

### Frontend

1. Go to `./frontend`.

2. Run `npm start`.

3. Go to "http://localhost:3000".