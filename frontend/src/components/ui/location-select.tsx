import React, { useEffect, useState } from 'react';
import { CountrySelect, StateSelect, CitySelect } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import { Label } from '@/components/ui/label';
import { Composites, Surface, Primary } from '../../theme';

const CountrySelectAny = CountrySelect as React.ComponentType<any>;
const StateSelectAny = StateSelect as React.ComponentType<any>;
const CitySelectAny = CitySelect as React.ComponentType<any>;

type CountryOption = any;
type StateOption = any;
type CityOption = any;

const INDIA_ID = 101;
const TAMIL_NADU_ID = 4035;

interface LocationSelectProps {
  country: string;
  state: string;
  city: string;
  onCountryChange: (name: string, id: number) => void;
  onStateChange: (name: string, id: number) => void;
  onCityChange: (name: string, id: number) => void;
  className?: string;
}

const containerClass = `!w-full !rounded-md border ${Surface.border[200]} ${Surface[50]} !bg-transparent !p-0 !shadow-none`;
const selectClass = `!w-full !h-10 !rounded-md !border-0 !bg-transparent !text-sm !font-semibold !shadow-none focus:!outline-none focus:!ring-0 !text-current !px-3 !py-2`;

const makeCountryOption = (id: number, name: string): CountryOption => ({
  id,
  name,
  iso3: '',
  iso2: '',
  numeric_code: '',
  phone_code: '',
  capital: '',
  currency: '',
  currency_name: '',
  currency_symbol: '',
  native: '',
  region: '',
  subregion: '',
  emoji: '',
  emojiU: '',
  tld: '',
  latitude: '',
  longitude: '',
  hasStates: true,
});

const makeStateOption = (id: number, name: string): StateOption => ({
  id,
  name,
  state_code: '',
  latitude: '',
  longitude: '',
  hasCities: true,
});

const makeCityOption = (id: number, name: string): CityOption => ({
  id,
  name,
  latitude: '',
  longitude: '',
});

const LocationSelect: React.FC<LocationSelectProps> = ({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
}) => {
  const [countryId, setCountryId] = useState<number>(INDIA_ID);
  const [stateId, setStateId] = useState<number>(TAMIL_NADU_ID);

  useEffect(() => {
    if (!country) {
      onCountryChange('India', INDIA_ID);
    }
    if (!state) {
      onStateChange('Tamil Nadu', TAMIL_NADU_ID);
    }
  }, [country, state, onCountryChange, onStateChange]);

  useEffect(() => {
    if (country === 'India') {
      setCountryId(INDIA_ID);
    }
    if (state === 'Tamil Nadu') {
      setStateId(TAMIL_NADU_ID);
    }
  }, [country, state]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="space-y-1">
        <Label className={Composites.filterLabel}>City</Label>
        <CitySelectAny
          countryid={countryId}
          stateid={stateId}
          defaultValue={city ? makeCityOption(0, city) : undefined}
          onChange={(e: any) => { onCityChange(e?.name ?? '', e?.id ?? 0); }}
          placeHolder="Select City"
          containerClassName={containerClass}
          inputClassName={selectClass}
        />
      </div>
      <div className="space-y-1">
        <Label className={Composites.filterLabel}>State</Label>
        <StateSelectAny
          countryid={countryId}
          defaultValue={state ? makeStateOption(stateId, state) : undefined}
          onChange={(e: any) => { setStateId(e?.id ?? 0); onStateChange(e?.name ?? '', e?.id ?? 0); onCityChange('', 0); }}
          placeHolder="Select State"
          containerClassName={containerClass}
          inputClassName={selectClass}
        />
      </div>
      <div className="space-y-1">
        <Label className={Composites.filterLabel}>Country</Label>
        <CountrySelectAny
          defaultValue={country ? makeCountryOption(countryId, country) : makeCountryOption(INDIA_ID, 'India')}
          onChange={(e: any) => { setCountryId(e?.id ?? 0); setStateId(0); onCountryChange(e?.name ?? '', e?.id ?? 0); onCityChange('', 0); }}
          placeHolder="Select Country"
          containerClassName={containerClass}
          inputClassName={selectClass}
        />
      </div>
    </div>
  );
};

export default LocationSelect;
