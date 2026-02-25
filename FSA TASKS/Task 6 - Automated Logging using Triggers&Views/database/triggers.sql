DELIMITER //

CREATE TRIGGER trg_employee_insert
AFTER INSERT ON employee
FOR EACH ROW
BEGIN
    INSERT INTO employee_audit_log(employee_id, action_type, new_data)
    VALUES (NEW.id, 'INSERT', CONCAT('name:', NEW.name, ', dept:', NEW.department, ', salary:', NEW.salary));
END;
//

DELIMITER ;
DELIMITER //

CREATE TRIGGER trg_employee_update
AFTER UPDATE ON employee
FOR EACH ROW
BEGIN
    INSERT INTO employee_audit_log(employee_id, action_type, old_data, new_data)
    VALUES (
        OLD.id,
        'UPDATE',
        CONCAT('name:', OLD.name, ', dept:', OLD.department, ', salary:', OLD.salary),
        CONCAT('name:', NEW.name, ', dept:', NEW.department, ', salary:', NEW.salary)
    );
END;
//

DELIMITER ;
