from pathlib import Path
file = Path('components/crop/CropDetailPage.tsx')
text = file.read_text(encoding='utf-8')
old = '''import {
  addCost,
  addHarvest,
  addActivity,
  getCostsByCrop,
  getHarvestsByCrop,
  getActivitiesByCrop,
  getCropById,
  deleteCrop,
  updateCrop,
  updateCost,
  deleteCost,
  updateActivity,
  deleteActivity,
  updateHarvest,
  deleteHarvest,
  type Crop,
  type Cost,
  type Harvest,
  type Activity,
} from '@/lib/cropDataService';'''
new = '''import { getCropById, deleteCrop, updateCrop, type Crop } from '@/lib/cropService';
import {
  addCost,
  addHarvest,
  addActivity,
  getCostsByCrop,
  getHarvestsByCrop,
  getActivitiesByCrop,
  updateCost,
  deleteCost,
  updateActivity,
  deleteActivity,
  updateHarvest,
  deleteHarvest,
  type Cost,
  type Harvest,
  type Activity,
} from '@/lib/cropDataService';'''
if old not in text:
    raise SystemExit('Import block not found')
file.write_text(text.replace(old, new), encoding='utf-8')
print('patched import block')
