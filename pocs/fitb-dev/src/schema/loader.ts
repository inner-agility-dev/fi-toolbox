
import schema from './fitb.schema.json';

export function getResourceSchema(name: string) {
  return schema.resources.find((res: any) => res.name === name);
}
