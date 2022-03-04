import os
import csv
import sqlite3
import argparse


def convert_to_hours(time):
    time = time.split()
    time_in_hours = 0
    for entry in time:
        last_char = entry[-1]
        entry = entry[:-1]
        if last_char == 'd':
            time_in_hours += float(entry) * 8
        if last_char == 'h':
            time_in_hours += float(entry)
        if last_char == 'm':
            time_in_hours += 1. / 60. * float(entry)
    return time_in_hours


def save(issues, records, output):
    db_file = "time_tracking/gtt.db"
    try:
        os.remove(db_file)
    except OSError:
        pass
    connection = sqlite3.connect(db_file)
    cursor = connection.cursor()
    cursor.execute("CREATE TABLE issue (iid,title,spent,total_estimate);")
    cursor.execute("CREATE TABLE record (user,date,type,iid,time);")

    with open(issues, 'r') as file:
        dict_reader = csv.DictReader(file)
        issues_to_db = [(entry['iid'], entry['title'], entry['spent'], entry['total_estimate']) for entry in
                        dict_reader]

    records_to_db = []
    with open(records, 'r') as file:
        dict_reader = csv.DictReader(file)
        for entry in dict_reader:
            date = entry['date'].split()
            date, time = date[0], date[1]
            date = date.split(".")
            date = date[2] + '-' + date[1] + '-' + date[0] + ' ' + time
            records_to_db.append((entry['user'], date, entry['type'], entry['iid'], convert_to_hours(entry['time'])))

    cursor.executemany("INSERT INTO issue (iid,title,spent,total_estimate) VALUES (?, ?, ?, ?);", issues_to_db)
    cursor.executemany("INSERT INTO record (user,date,type,iid,time) VALUES (?, ?, ?, ?, ?);", records_to_db)
    connection.commit()

    if output:
        for row in cursor.execute(
                'SELECT record.date, issue.title, record.time FROM record LEFT JOIN issue ON issue.iid = record.iid;'):
            print(row)
    connection.close()


def check_file(file_path):
    assert os.path.exists(file_path), 'File {} does not exist!'.format(file_path)


def main_function():
    parser = argparse.ArgumentParser(description='gitlab-time-tracker CSV files to SQLite file.', )
    parser.add_argument('-i', '--issues', dest='issues', help='CSV file with issues', required=True)
    parser.add_argument('-r', '--records', dest='records', help='CSV file with records', required=True)
    parser.add_argument('-p', '--print', dest='output', help='Print', action='store_true')
    args = parser.parse_args()
    check_file(args.records)
    check_file(args.issues)
    save(issues=args.issues, records=args.records, output=args.output)


if __name__ == "__main__":
    main_function()
