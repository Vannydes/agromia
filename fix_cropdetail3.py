import re
from pathlib import Path
file = Path('components/crop/CropDetailPage.tsx')
text = file.read_text(encoding='utf-8')
pattern = re.compile(r"import \{\s*addCost,\s*addHarvest,\s*addActivity,\s*getCostsByCrop,\s*getHarvestsByCrop,\s*getActivitiesByCrop,\s*getCropById,\s*deleteCrop,\s*updateCrop,\s*updateCost,\s*deleteCost,\s*updateActivity,\s*deleteActivity,\s*updateHarvest,\s*deleteHarvest,\s*type Crop,\s*type Cost,\s*type Harvest,\s*type Activity,\s*\} from '@/lib/cropDataService';", re.DOTALL)
new = "import { getCropById, deleteCrop, updateCrop, type Crop } from '@/lib/cropService';\nimport {\n  addCost,\n  addHarvest,\n  addActivity,\n  getCostsByCrop,\n  getHarvestsByCrop,\n  getActivitiesByCrop,\n  updateCost,\n  deleteCost,\n  updateActivity,\n  deleteActivity,\n  updateHarvest,\n  deleteHarvest,\n  type Cost,\n  type Harvest,\n  type Activity,\n} from '@/lib/cropDataService';"
new_text, count = pattern.subn(new, text, count=1)
if count != 1:
    raise SystemExit(f'Pattern replacement count was {count}')
file.write_text(new_text, encoding='utf-8')
print('patched import block with regex')
