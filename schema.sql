CREATE TABLE contact (
    id SERIAL PRIMARY KEY, --sequential ids, not null by default
    phone_number VARCHAR(15),
    email VARCHAR(100),
    linked_id INTEGER,
    link_precedence VARCHAR(9) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contact_email ON contact(email);
CREATE INDEX idx_contact_phone ON contact(phone_number);
CREATE INDEX idx_contact_linked_id ON contact(linked_id);
