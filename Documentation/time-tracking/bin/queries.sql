SELECT
  record.date,
  issue.title,
  record.time
FROM record
  LEFT JOIN issue ON issue.iid = record.iid;


select
    strftime('%W', record.date) WeekNumber,
    max(date(record.date, 'weekday 0', '-7 day')) WeekStart,
    max(date(record.date, 'weekday 0', '-1 day')) WeekEnd,
    total(record.time) SpendTime
from record record
group by WeekNumber;