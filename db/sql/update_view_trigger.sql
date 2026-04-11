CREATE OR REPLACE FUNCTION update_view_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_view_trigger
BEFORE UPDATE ON views
FOR EACH ROW
EXECUTE FUNCTION update_view_trigger();