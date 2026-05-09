# Setup Database per Custom Crops

Per abilitare il supporto per le colture personalizzate, devi eseguire la migrazione nel database Supabase:

## Passi:

1. Vai su [Supabase Console](https://supabase.com/dashboard)
2. Seleziona il progetto Agromia
3. Vai su SQL Editor
4. Apri il file `supabase/migrations/add_custom_crop_support.sql`
5. Copia il contenuto del file
6. Incolla nella console SQL di Supabase
7. Clicca su "Run" per eseguire la migrazione

## Schema Finale:

### Tabella `crops` (aggiornata)
```sql
- id UUID (PRIMARY KEY)
- user_id UUID (FOREIGN KEY → auth.users)
- name TEXT
- plants INTEGER
- custom_crop_id UUID (FOREIGN KEY → custom_crops, NULLABLE)
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

### Tabella `custom_crops` (nuova)
```sql
- id UUID (PRIMARY KEY)
- user_id UUID (FOREIGN KEY → auth.users)
- name TEXT
- spacing_cm INTEGER
- min_yield DECIMAL
- max_yield DECIMAL
- created_at TIMESTAMP
```

## RLS Policies

Entrambe le tabelle hanno RLS policies che garantiscono che ogni utente possa vedere/modificare solo le proprie colture.

## Nota

Se utilizzi la production Vercel, dovrai eseguire la migrazione nel database Supabase production.
