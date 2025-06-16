CREATE TABLE provider_services (
                                   id SERIAL PRIMARY KEY,
                                   provider_id INTEGER NOT NULL,
                                   service_name VARCHAR(255) NOT NULL,
                                   CONSTRAINT fk_provider FOREIGN KEY (provider_id) REFERENCES users(id)
);

CREATE TABLE provider_availability (
                                       id SERIAL PRIMARY KEY,
                                       provider_id INTEGER NOT NULL,
                                       available_date TIMESTAMP NOT NULL,
                                       service_name VARCHAR(255),
                                       CONSTRAINT fk_provider_avail FOREIGN KEY (provider_id) REFERENCES users(id)
);
