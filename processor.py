import csv
import datetime

def excel_date_to_iso(serial):
    if not serial or serial == '':
        return None
    try:
        serial = float(serial)
        # Excel date starts from 1899-12-30
        dt = datetime.datetime(1899, 12, 30) + datetime.timedelta(days=serial)
        return dt.strftime('%Y-%m-%d')
    except:
        return None

def parse_date(date_str):
    if not date_str or date_str == '':
        return None
    try:
        # Expected format M/D/YY or M/D/YYYY
        parts = date_str.split('/')
        if len(parts) == 3:
            month, day, year = parts
            if len(year) == 2:
                year = '20' + year
            return f"{year}-{int(month):02d}-{int(day):02d}"
    except:
        pass
    return None

def get_status(progress_pct):
    if progress_pct >= 100:
        return 'DONE'
    if progress_pct > 0:
        return 'IN_PROGRESS'
    return 'NOT_STARTED'

# Programs
programs = []
with open('고도화-표 1.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)
    # Data starts from row 6 (index 5)
    count = 0
    for row in rows[5:]:
        if count >= 24:
            break
        if not row or len(row) < 11:
            continue
        
        name = row[8]
        if not name:
            continue
            
        code = row[10] or row[9] or f"PG-2026-{count+1:02d}"
        owner = row[24] or row[29] # Try other developer column if empty
        
        # 진척율 is in column 34 (index 34)
        progress_pct_str = '0'
        if len(row) > 34:
            progress_pct_str = row[34].replace('%', '') if row[34] else '0'
        
        try:
            progress_pct = int(float(progress_pct_str))
        except:
            progress_pct = 0
            
        baseline_start = parse_date(row[19]) if len(row) > 19 else None
        baseline_end = parse_date(row[20]) if len(row) > 20 else None
        actual_start = parse_date(row[21]) if len(row) > 21 else None
        actual_end = parse_date(row[22]) if len(row) > 22 else None
        
        programs.append({
            'id': f'PG-2026-{count+1:02d}',
            'projectId': 'P-2026',
            'code': code,
            'name': {'en': name, 'ko': name},
            'owner': owner or 'TBD',
            'status': get_status(progress_pct),
            'progressPct': progress_pct,
            'baselineStart': baseline_start,
            'baselineEnd': baseline_end,
            'actualStart': actual_start,
            'actualEnd': actual_end
        })
        count += 1

# Tasks
tasks = []
with open('WBS_선행개발-표 1.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)
    # Data starts around row 10 (index 9)
    count = 0
    for row in rows[9:]:
        if count >= 40:
            break
        if not row or len(row) < 15:
            continue
            
        dep_val = row[3]
        try:
            dep = int(dep_val)
        except:
            continue
            
        if dep > 3:
            continue
            
        name = row[4 + dep]
        if not name:
            continue
            
        baseline_start = excel_date_to_iso(row[12])
        baseline_end = excel_date_to_iso(row[13])
        actual_start = excel_date_to_iso(row[18])
        actual_end = excel_date_to_iso(row[19])
        
        tasks.append({
            'id': f'T-2026-{count+1:02d}',
            'projectId': 'P-2026',
            'name': {'en': name, 'ko': name},
            'baselineStart': baseline_start,
            'baselineEnd': baseline_end,
            'actualStart': actual_start,
            'actualEnd': actual_end
        })
        count += 1

print("--- PROGRAMS ---")
import json
print(json.dumps(programs, indent=2, ensure_ascii=False))
print("--- TASKS ---")
print(json.dumps(tasks, indent=2, ensure_ascii=False))
