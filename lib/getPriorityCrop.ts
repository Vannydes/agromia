export type UserCrop = {
  id: string;
  name: string;
  plants: number;
  harvests?: { kg: number; date: string }[];
};

export function getPriorityCrop(crops: UserCrop[]) {
  if (!crops || crops.length === 0) return null;

  return crops.reduce((prev, current) =>
    current.plants > prev.plants ? current : prev
  );
}
