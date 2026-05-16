from pathlib import Path
file = Path('components/crop/CropDetailPage.tsx')
text = file.read_text(encoding='utf-8')
replacements = [
    ("import {\n  addCost,\n  addHarvest,\n  addActivity,\n  getCostsByCrop,\n  getHarvestsByCrop,\n  getActivitiesByCrop,\n  getCropById,\n  deleteCrop,\n  updateCrop,\n  updateCost,\n  deleteCost,\n  updateActivity,\n  deleteActivity,\n  updateHarvest,\n  deleteHarvest,\n  type Crop,\n  type Cost,\n  type Harvest,\n  type Activity,\n} from '@/lib/cropDataService';\nimport { crops } from '@/lib/crops';\n",
     "import { getCropById, deleteCrop, updateCrop } from '@/lib/cropService';\nimport {\n  addCost,\n  addHarvest,\n  addActivity,\n  getCostsByCrop,\n  getHarvestsByCrop,\n  getActivitiesByCrop,\n  deleteCost,\n  updateCost,\n  deleteActivity,\n  updateActivity,\n  deleteHarvest,\n  updateHarvest,\n  type Cost,\n  type Harvest,\n  type Activity,\n} from '@/lib/cropDataService';\nimport { crops } from '@/lib/crops';\n"),
    ("type TimelineEvent = {\n  type: Activity['activity_type'] | 'raccolta';\n  note: string;\n  date: string;\n  id?: string;\n};\n",
     "type TimelineEvent = {\n  type: Activity['type'] | 'raccolta';\n  note: string;\n  date: string;\n  id?: string;\n};\n"),
    ("    activities.forEach((activity) => {\n      events.push({\n        type: activity.activity_type,\n        note: activity.notes || activity.activity_type,\n        date: activity.activity_date,\n        id: activity.id,\n      });\n    });\n",
     "    activities.forEach((activity) => {\n      events.push({\n        type: activity.type,\n        note: activity.note || activity.type,\n        date: activity.date,\n        id: activity.id,\n      });\n    });\n"),
    ("  const handleEditActivity = (activity: Activity) => {\n    setEditingActivityId(activity.id);\n    setEditActivityType(activity.activity_type);\n    setEditActivityDate(activity.activity_date);\n  };\n",
     "  const handleEditActivity = (activity: Activity) => {\n    setEditingActivityId(activity.id);\n    setEditActivityType(activity.type);\n    setEditActivityDate(activity.date);\n  };\n"),
    ("      await updateActivity(activityId, {\n        activity_type: editActivityType,\n        activity_date: editActivityDate,\n      });\n",
     "      await updateActivity(activityId, {\n        type: editActivityType,\n        date: editActivityDate,\n      });\n"),
    ("  const handleEditHarvest = (harvest: Harvest) => {\n    setEditingHarvestId(harvest.id);\n    setEditHarvestKg(harvest.quantity_kg.toString());\n    setEditHarvestNotes(harvest.notes ?? '');\n  };\n",
     "  const handleEditHarvest = (harvest: Harvest) => {\n    setEditingHarvestId(harvest.id);\n    setEditHarvestKg(harvest.quantity_kg.toString());\n    setEditHarvestNotes(harvest.note ?? '');\n  };\n"),
    ("      await updateHarvest(harvestId, {\n        quantity_kg: quantity,\n        notes: editHarvestNotes.trim() || null,\n      });\n",
     "      await updateHarvest(harvestId, {\n        quantity_kg: quantity,\n        note: editHarvestNotes.trim() || null,\n      });\n"),
    ("      await addHarvest(crop.id, kg, `Raccolti ${kg.toFixed(1)} kg`);\n",
     "      const date = new Date().toISOString().slice(0, 10);\n      await addHarvest(crop.id, date, kg, `Raccolti ${kg.toFixed(1)} kg`);\n"),
    ("    setEditCostTitle(cost.title);\n  };\n",
     "    setEditCostTitle(cost.note ?? '');\n  };\n"),
    ("                            <span className=\"text-sm font-medium text-slate-700\">{cost.title}</span>\n",
     "                            <span className=\"text-sm font-medium text-slate-700\">{cost.note}</span>\n"),
    ("      setEditActivityType(activity.activity_type);\n",
     "      setEditActivityType(activity.type);\n"),
    ("      setEditActivityDate(activity.activity_date);\n",
     "      setEditActivityDate(activity.date);\n"),
    ("                            <span className=\"text-sm text-slate-500\">{new Date(activity.activity_date).toLocaleDateString('it-IT')}</span>\n",
     "                            <span className=\"text-sm text-slate-500\">{new Date(activity.date).toLocaleDateString('it-IT')}</span>\n"),
    ("                            <p className=\"text-sm text-slate-700\">{activity.notes || activity.activity_type}</p>\n",
     "                            <p className=\"text-sm text-slate-700\">{activity.note || activity.type}</p>\n"),
    ("                    onChange={(event) => setEditActivityType(event.target.value as Activity['activity_type'])}\n",
     "                    onChange={(event) => setEditActivityType(event.target.value as Activity['type'])}\n"),
    ("                                          {activity.activity_type}\n",
     "                                          {activity.type}\n"),
]
for old, new in replacements:
    if old not in text:
        raise SystemExit(f'Replacement not found: {old[:80]}...')
    text = text.replace(old, new)
file.write_text(text, encoding='utf-8')
print('CropDetailPage.tsx patched')
