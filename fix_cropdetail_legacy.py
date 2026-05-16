from pathlib import Path
p = Path('components/crop/CropDetailPage.tsx')
text = p.read_text(encoding='utf-8')
text = text.replace('\r\n', '\n')
replacements = [
    ("import {\n  addCost,\n  addHarvest,\n  addActivity,\n  getCostsByCrop,\n  getHarvestsByCrop,\n  getActivitiesByCrop,\n  deleteCost,\n  deleteActivity,\n  deleteHarvest,\n  type Cost,\n  type Harvest,\n  type Activity,\n} from '@/lib/cropDataService';",
     "import {\n  addCost,\n  addHarvest,\n  addActivity,\n  getCostsByCrop,\n  getHarvestsByCrop,\n  getActivitiesByCrop,\n  updateCost,\n  deleteCost,\n  updateActivity,\n  deleteActivity,\n  updateHarvest,\n  deleteHarvest,\n  type Cost,\n  type Harvest,\n  type Activity,\n} from '@/lib/cropDataService';"),
    ("type: Activity['activity_type'] | 'raccolta';", "type: Activity['type'] | 'raccolta';"),
    ("const [editActivityType, setEditActivityType] = useState<Activity['activity_type']>('trapianto');", "const [editActivityType, setEditActivityType] = useState<Activity['type']>('trapianto');"),
    ("const [eventType, setEventType] = useState<Activity['activity_type']>('trapianto');", "const [eventType, setEventType] = useState<Activity['type']>('trapianto');"),
    ("type: activity.activity_type,", "type: activity.type,"),
    ("note: activity.notes || activity.activity_type,", "note: activity.note || activity.type,"),
    ("date: activity.activity_date,", "date: activity.date,"),
    ("setEditActivityType(activity.activity_type);", "setEditActivityType(activity.type);"),
    ("setEditActivityDate(activity.activity_date);", "setEditActivityDate(activity.date);"),
    ("activity_type: editActivityType,", "type: editActivityType,"),
    ("activity_date: editActivityDate,", "date: editActivityDate,"),
    ("setEditHarvestNotes(harvest.notes ?? '');", "setEditHarvestNotes(harvest.note ?? '');"),
    ("notes: editHarvestNotes.trim() || null,", "note: editHarvestNotes.trim() || null,"),
    ("setEditCostTitle(cost.title);", "setEditCostTitle(cost.note ?? '');"),
    ("title: editCostTitle.trim(),", "note: editCostTitle.trim(),"),
    ("onChange={(event) => setEditActivityType(event.target.value as Activity['activity_type'])}", "onChange={(event) => setEditActivityType(event.target.value as Activity['type'])}"),
    ("{activity.activity_type}", "{activity.type}"),
    ("new Date(activity.activity_date).toLocaleDateString('it-IT')", "new Date(activity.date).toLocaleDateString('it-IT')"),
    ("{activity.notes || activity.activity_type}", "{activity.note || activity.type}"),
    ("{cost.title}", "{cost.note}"),
]
for old, new in replacements:
    if old not in text:
        raise SystemExit(f'Missing pattern: {old}')
    text = text.replace(old, new)
p.write_text(text, encoding='utf-8')
print('patched replacements')
