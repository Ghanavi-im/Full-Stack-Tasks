CREATE VIEW daily_employee_activity AS
SELECT 
    DATE(action_time) AS activity_date,
    action_type,
    COUNT(*) AS total_actions
FROM employee_audit_log
GROUP BY DATE(action_time), action_type
ORDER BY activity_date DESC;
