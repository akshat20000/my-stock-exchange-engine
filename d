                                          Table "public.users"
    Column     |            Type             | Collation | Nullable |              Default              
---------------+-----------------------------+-----------+----------+-----------------------------------
 id            | integer                     |           | not null | nextval('users_id_seq'::regclass)
 username      | character varying(50)       |           |          | 
 balance       | double precision            |           |          | 
 password_hash | character varying(255)      |           |          | 
 created_at    | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 last_login    | timestamp without time zone |           |          | 
 is_active     | boolean                     |           |          | true
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "unique_username" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "balance_history" CONSTRAINT "balance_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    TABLE "user_sessions" CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

