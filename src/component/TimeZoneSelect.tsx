import { flatten, sortedUniq } from 'lodash';
import React from 'react';
import { Zone, IANAZone } from 'luxon';
import TIMEZONES from 'timezones.json';

const IANA_OPTIONS = sortedUniq(
  flatten(TIMEZONES.map(t => t.utc))
    .filter(z => !z.startsWith('Etc/') && z.search('/') !== -1)
    .sort()
).map(z => (
  <option value={z} key={z}>
    {z}
  </option>
));

type Props = {
  value: Zone;
  onChange: (v: Zone) => void;
};

export default function TimeZoneSelect({ value, onChange }: Props) {
  return (
    <select
      style={{ maxWidth: 200 }}
      value={value.name}
      onChange={e => {
        const z = new IANAZone(e.currentTarget.value);

        onChange(z);
      }}
    >
      {IANA_OPTIONS}
    </select>
  );
}
