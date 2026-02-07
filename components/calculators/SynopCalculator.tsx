'use client';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './SynopCalculator.module.css';
import {
    STATION_NAMES,
    WEATHER_CODES,
    PAST_WEATHER_CODES,
    CLOUD_FORM_CODES,
    CLOUD_HEIGHT_CODES,
    INDIVIDUAL_HEIGHT_CODES,
    CLOUD_AMOUNT_CODES,
    LOW_CLOUD_FORM_CODES,
    MEDIUM_CLOUD_FORM_CODES,
    HIGH_CLOUD_FORM_CODES,
    WIND_DIRECTION_CODES,
    VISIBILITY_CODES
} from './SynopConstants';

// Helper to format numbers with padding
const pad = (num: number | string, size: number) => {
    let s = String(num);
    while (s.length < size) s = "0" + s;
    return s;
};

// Interface for Form Data
interface SynopFormData {
    station: string;
    observationDate: string;
    timeFormat: '12' | '24' | 'UTC';
    hour: string;
    minute: string;
    second: string;
    ampm: 'AM' | 'PM';
    synopTime: string; // Calculated or selected

    barReading: string;
    slp: string;
    mslp: string;
    pressureChange: string;

    dryBulb: string;
    wetBulb: string;
    maxTemp: string;
    minTemp: string;
    dewPoint: string;
    relativeHumidity: string;
    vapourPressure: string;

    windDirection: string;
    windSpeed: string;
    visibility: string;
    manualVisibility: string;

    // Cloud General
    cloudStatus: 'skc' | 'cp' | 'so' | '';
    lowCloudForm: string;
    lowCloudAmount: string;
    mediumCloudForm: string;
    mediumCloudAmount: string;
    highCloudForm: string;
    highCloudAmount: string;
    totalCloudAmount: string;
    lowestLayerHeight: string;

    // Rainfall
    rfSinceLastObs: string;
    rf0830to1730: string;
    rf1730to0830: string;
    rf0830to0830: string;
    seasonalRF: string;

    // Weather
    presentWeather: string;
    pastWeather1: string;
    pastWeather2: string;
}

interface CloudLayer {
    id: number;
    form: string;
    amount: string;
    height: string;
}

interface WeatherTiming {
    id: number;
    weatherCode: string;
    startTime: string;
    endTime: string;
}

interface SearchableDropdownProps {
    name: string;
    value: string;
    options: { value: string, label: string }[];
    onChange: (e: { target: { name: string, value: string } }) => void;
    placeholder?: string;
    disabled?: boolean;
    scrollToSelected?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ name, value, options, onChange, placeholder, disabled, scrollToSelected = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [bypass, setBypass] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    // Sync search text with value
    useEffect(() => {
        const selected = options.find(o => o.value === value);
        if (selected) setSearch(selected.label);
        else if (value) setSearch(value);
        else setSearch('');
    }, [value, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Revert search text to current value on close
                const selected = options.find(o => o.value === value);
                if (selected) setSearch(selected.label);
                else if (value) setSearch(value);
                else setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value, options]);

    // Auto-scroll to selected option when dropdown opens
    useEffect(() => {
        if (isOpen && wrapperRef.current && scrollToSelected) {
            const list = wrapperRef.current.querySelector(`.${styles.dropdownList}`);
            if (list) {
                const selectedEl = list.querySelector(`[data-value="${value}"]`);
                if (selectedEl) {
                    selectedEl.scrollIntoView({ block: 'nearest' });
                }
            }
        }
    }, [isOpen, value]);

    return (
        <div className={styles.searchContainer} ref={wrapperRef}>
            <input
                type="text"
                name={name}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setBypass(false);
                    setIsOpen(true);
                }}
                onFocus={(e) => {
                    e.target.select();
                    setIsOpen(true);
                }}
                placeholder={placeholder}
                autoComplete="off"
                disabled={disabled}
            />
            <button
                type="button"
                className={styles.dropdownToggle}
                onClick={() => {
                    setBypass(true);
                    setIsOpen(!isOpen);
                }}
                disabled={disabled}
                tabIndex={-1}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            {isOpen && !disabled && (
                <div className={styles.dropdownList}>
                    {options
                        .filter(opt => {
                            if (bypass) return true;
                            const s = search.toLowerCase();
                            return opt.label.toLowerCase().includes(s) || opt.value.toLowerCase().includes(s);
                        })
                        .map(opt => (
                            <div
                                key={opt.value}
                                data-value={opt.value}
                                className={styles.dropdownItem}
                                onClick={() => {
                                    onChange({ target: { name, value: opt.value } });
                                    setIsOpen(false);
                                    setBypass(false);
                                }}
                            >
                                {opt.label}
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
};

const WeatherTimeSelector: React.FC<{
    value: string;
    onChange: (val: string) => void;
    format: '12' | '24' | 'UTC';
}> = ({ value, onChange, format }) => {
    // Parse HH:mm
    let h = 0, m = 0;
    if (value) {
        const parts = value.split(':');
        h = parseInt(parts[0]) || 0;
        m = parseInt(parts[1]) || 0;
    }

    const handleChange = (type: 'h' | 'm' | 'ampm', val: string) => {
        let newH = h;
        let newM = m;
        // Parsing logic remains same...
        if (type === 'm') {
            newM = parseInt(val);
        } else if (format === '12') {
            if (type === 'h') {
                const hour12 = parseInt(val);
                const isPM = h >= 12;
                newH = isPM ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
            } else if (type === 'ampm') {
                const isPM = val === 'PM';
                const hour12 = h % 12 || 12;
                newH = isPM ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
            }
        } else {
            if (type === 'h') newH = parseInt(val);
        }

        const hStr = newH.toString().padStart(2, '0');
        const mStr = newM.toString().padStart(2, '0');
        onChange(`${hStr}:${mStr}`);
    };

    const minOptions = Array.from({ length: 60 }, (_, i) => ({ value: String(i), label: String(i).padStart(2, '0') }));

    if (format === '12') {
        const hour = h % 12 || 12;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hourOptions = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1).padStart(2, '0') }));

        return (
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                    <SearchableDropdown
                        name="h" value={String(hour)}
                        options={hourOptions}
                        onChange={(e) => handleChange('h', e.target.value)}
                        placeholder="HH" scrollToSelected={false}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <SearchableDropdown
                        name="m" value={String(m)}
                        options={minOptions}
                        onChange={(e) => handleChange('m', e.target.value)}
                        placeholder="MM" scrollToSelected={false}
                    />
                </div>
                <div style={{ width: '80px' }}>
                    <SearchableDropdown
                        name="ampm" value={ampm}
                        options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]}
                        onChange={(e) => handleChange('ampm', e.target.value)}
                        placeholder="AP" scrollToSelected={false}
                    />
                </div>
            </div>
        );
    }

    // 24h / UTC
    const hourOptions = Array.from({ length: 24 }, (_, i) => ({ value: String(i), label: String(i).padStart(2, '0') }));

    return (
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <div style={{ flex: 1 }}>
                <SearchableDropdown
                    name="h" value={String(h)}
                    options={hourOptions}
                    onChange={(e) => handleChange('h', e.target.value)}
                    placeholder="HH" scrollToSelected={false}
                />
            </div>
            <div style={{ flex: 1 }}>
                <SearchableDropdown
                    name="m" value={String(m)}
                    options={minOptions}
                    onChange={(e) => handleChange('m', e.target.value)}
                    placeholder="MM" scrollToSelected={false}
                />
            </div>
        </div>
    );
};

const SynopCalculator = () => {
    // --- State ---
    const [formData, setFormData] = useState<SynopFormData>({
        station: '42542', // Default to Dabok/Udaipur
        observationDate: new Date().toISOString().split('T')[0],
        timeFormat: '12',
        hour: String(new Date().getHours() > 12 ? new Date().getHours() - 12 : (new Date().getHours() === 0 ? 12 : new Date().getHours())),
        minute: String(new Date().getMinutes()).padStart(2, '0'),
        second: '00',
        ampm: new Date().getHours() >= 12 ? 'PM' : 'AM',
        synopTime: '00',

        barReading: '',
        slp: '956.5',
        mslp: '1016.8',
        pressureChange: '-0.5',

        dryBulb: '25.6',
        wetBulb: '',
        maxTemp: '35.0',
        minTemp: '16.5',
        dewPoint: '16.6',
        relativeHumidity: '66',
        vapourPressure: '',

        windDirection: '00',
        windSpeed: '00',
        visibility: '96',
        manualVisibility: '',

        cloudStatus: 'skc',
        lowCloudForm: '0',
        lowCloudAmount: '0',
        mediumCloudForm: '0',
        mediumCloudAmount: '0',
        highCloudForm: '0',
        highCloudAmount: '0',
        totalCloudAmount: '0',
        lowestLayerHeight: '9',

        rfSinceLastObs: '000.0',
        rf0830to1730: '000.0',
        rf1730to0830: '000.0',
        rf0830to0830: '000.0',
        seasonalRF: '000.0',

        presentWeather: '',
        pastWeather1: '',
        pastWeather2: ''
    });

    const dateInputRef = React.useRef<HTMLInputElement>(null);

    const [cloudLayers, setCloudLayers] = useState<CloudLayer[]>([
        { id: 1, form: '0', amount: '0', height: '99' },
        { id: 2, form: '0', amount: '0', height: '99' },
        { id: 3, form: '0', amount: '0', height: '99' },
        { id: 4, form: '0', amount: '0', height: '99' }
    ]);

    const [message, setMessage] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

    // Weather Timing State
    const [weatherTimeFormat, setWeatherTimeFormat] = useState<'12' | '24' | 'UTC'>('24');
    const [weatherTimings, setWeatherTimings] = useState<WeatherTiming[]>([
        { id: 1, weatherCode: '', startTime: '', endTime: '' }
    ]);

    const addTiming = () => {
        setWeatherTimings(prev => [...prev, { id: Date.now(), weatherCode: '', startTime: '', endTime: '' }]);
    };

    const removeTiming = (id: number) => {
        setWeatherTimings(prev => prev.filter(t => t.id !== id));
    };

    const updateTiming = (id: number, field: keyof WeatherTiming, value: string) => {
        setWeatherTimings(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const calculateDurationMins = (start: string, end: string): number => {
        if (!start || !end) return 0;
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return 0;

        let sMins = sh * 60 + sm;
        const eMins = eh * 60 + em;

        let diff = eMins - sMins;
        if (diff < 0) diff += 1440;

        return diff;
    };

    const getDurationString = (start: string, end: string) => {
        const mins = calculateDurationMins(start, end);
        return `${mins} mins`;
    };

    const timingSummary = React.useMemo(() => {
        const summary: Record<string, number> = {};
        weatherTimings.forEach(t => {
            if (!t.weatherCode || !t.startTime || !t.endTime) return;
            const code = t.weatherCode.split(' - ')[0];
            const mins = calculateDurationMins(t.startTime, t.endTime);
            summary[code] = (summary[code] || 0) + mins;
        });
        return summary;
    }, [weatherTimings]);

    // Filtered lists for searchable dropdowns
    // Filtered lists for searchable dropdowns - bypass flags allow showing all options on button click
    const [stationSearch, setStationSearch] = useState('');
    const [showStationDropdown, setShowStationDropdown] = useState(false);
    const [bypassStationFilter, setBypassStationFilter] = useState(false);
    const [weatherSearch, setWeatherSearch] = useState('');
    const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);
    const [bypassWeatherFilter, setBypassWeatherFilter] = useState(false);
    const [showPastWeather1Dropdown, setShowPastWeather1Dropdown] = useState(false);
    const [bypassPastWeather1Filter, setBypassPastWeather1Filter] = useState(false);
    const [showPastWeather2Dropdown, setShowPastWeather2Dropdown] = useState(false);
    const [bypassPastWeather2Filter, setBypassPastWeather2Filter] = useState(false);

    // Ref for detecting clicks outside
    const stationRef = React.useRef<HTMLDivElement>(null);
    const weatherRef = React.useRef<HTMLDivElement>(null);
    const pastWeather1Ref = React.useRef<HTMLDivElement>(null);
    const pastWeather2Ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (stationRef.current && !stationRef.current.contains(event.target as Node)) {
                setShowStationDropdown(false);
            }
            if (weatherRef.current && !weatherRef.current.contains(event.target as Node)) {
                setShowWeatherDropdown(false);
            }
            if (pastWeather1Ref.current && !pastWeather1Ref.current.contains(event.target as Node)) {
                setShowPastWeather1Dropdown(false);
            }
            if (pastWeather2Ref.current && !pastWeather2Ref.current.contains(event.target as Node)) {
                setShowPastWeather2Dropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Logic Helpers ---

    // Calculate Synop Time based on Hour/Minute/Format
    const calculateSynopTime = useCallback(() => {
        let hour = parseInt(formData.hour) || 0;
        const minute = parseInt(formData.minute) || 0;
        let totalMins = hour * 60 + minute;

        if (formData.timeFormat === '12') {
            if (hour === 12) hour = formData.ampm === 'AM' ? 0 : 12;
            else if (formData.ampm === 'PM') hour += 12;
            totalMins = hour * 60 + minute;
        }

        if (formData.timeFormat === 'UTC') {
            if (totalMins > 1350 || totalMins <= 90) return "00";
            if (totalMins <= 270) return "03";
            if (totalMins <= 450) return "06";
            if (totalMins <= 630) return "09";
            if (totalMins <= 810) return "12";
            if (totalMins <= 990) return "15";
            if (totalMins <= 1170) return "18";
            return "21";
        }

        // IST Logic
        if (totalMins >= 180 && totalMins <= 360) return "00";
        if (totalMins > 360 && totalMins <= 540) return "03";
        if (totalMins > 540 && totalMins <= 720) return "06";
        if (totalMins > 720 && totalMins <= 900) return "09";
        if (totalMins > 900 && totalMins <= 1080) return "12";
        if (totalMins > 1080 && totalMins <= 1260) return "15";
        if (totalMins > 1260 || totalMins === 0) return "18"; // Midnight crossover
        if (totalMins > 0 && totalMins < 180) return "21";

        return "00";
    }, [formData.hour, formData.minute, formData.timeFormat, formData.ampm]);

    // Update Synop Time when time inputs change
    useEffect(() => {
        const time = calculateSynopTime();
        setFormData(prev => {
            if (prev.synopTime !== time) return { ...prev, synopTime: time };
            return prev;
        });
    }, [calculateSynopTime]);

    // Update Cloud Logic based on Status
    useEffect(() => {
        const status = formData.cloudStatus;
        if (status === 'skc') {
            // Sky Clear: everything 0 or 9 (height) or disabled
            setFormData(prev => ({
                ...prev,
                lowCloudForm: '0', lowCloudAmount: '0', mediumCloudForm: '0', mediumCloudAmount: '0',
                highCloudForm: '0', highCloudAmount: '0', totalCloudAmount: '0', lowestLayerHeight: '9'
            }));
            setCloudLayers([
                { id: 1, form: '0', amount: '0', height: '99' },
                { id: 2, form: '0', amount: '0', height: '99' },
                { id: 3, form: '0', amount: '0', height: '99' },
                { id: 4, form: '0', amount: '0', height: '99' }
            ]);
        } else if (status === 'so') {
            // Sky Obscured
            setFormData(prev => ({
                ...prev,
                lowCloudForm: '/', lowCloudAmount: '/', mediumCloudForm: '/', mediumCloudAmount: '/',
                highCloudForm: '/', highCloudAmount: '/', totalCloudAmount: '9', lowestLayerHeight: '/'
            }));
            setCloudLayers([
                { id: 1, form: '/', amount: '/', height: '/' },
                { id: 2, form: '/', amount: '/', height: '/' },
                { id: 3, form: '/', amount: '/', height: '/' },
                { id: 4, form: '/', amount: '/', height: '/' }
            ]);
        } else if (status === 'cp') {
            // Unlock clouds and set all default heights to 00
            setCloudLayers(prev => prev.map(l => ({
                ...l,
                height: '00',
                form: '0',
                amount: '0'
            })));
        }
        // 'cp' (Clouds Present) just unlocks, doesn't force values mostly
    }, [formData.cloudStatus]);

    // Automatic Cloud Parameter Logic (for 'Clouds Present' status)
    useEffect(() => {
        if (formData.cloudStatus !== 'cp') return;

        setFormData(prev => {
            const updates: Partial<SynopFormData> = {};

            // 1. Lowest Height Logic based on Low Cloud Form
            if (['6', '7'].includes(prev.lowCloudForm)) {
                if (prev.lowestLayerHeight !== '4') updates.lowestLayerHeight = '4';
            } else if (['1', '2', '3', '4', '5', '8', '9'].includes(prev.lowCloudForm)) {
                if (prev.lowestLayerHeight !== '5') updates.lowestLayerHeight = '5';
            }

            // 2. Total Cloud Amount = Sum of Low + Medium + High (capped at 8)
            const lowAmt = parseInt(prev.lowCloudAmount) || 0;
            const medAmt = parseInt(prev.mediumCloudAmount) || 0;
            const highAmt = parseInt(prev.highCloudAmount) || 0;
            const totalSum = Math.min(8, lowAmt + medAmt + highAmt);
            const totalSumStr = String(totalSum);

            if (prev.totalCloudAmount !== totalSumStr) {
                updates.totalCloudAmount = totalSumStr;
            }

            if (Object.keys(updates).length > 0) {
                return { ...prev, ...updates };
            }
            return prev;
        });
    }, [
        formData.cloudStatus,
        formData.lowCloudForm,
        formData.lowCloudAmount,
        formData.mediumCloudAmount,
        formData.highCloudAmount
    ]);

    // Visibility Logic
    useEffect(() => {
        if (formData.manualVisibility) {
            const val = parseFloat(formData.manualVisibility);
            let code = '96';
            if (!isNaN(val)) {
                if (val < 50) code = '90';
                else if (val < 200) code = '91';
                else if (val < 500) code = '92';
                else if (val < 1000) code = '93';
                else if (val < 2000) code = '94';
                else if (val < 4000) code = '95';
                else if (val < 10000) code = '96';
                else code = '97';
            }
            setFormData(prev => prev.visibility !== code ? { ...prev, visibility: code } : prev);
        }
    }, [formData.manualVisibility]);

    // Auto-fetch/Format time when format changes
    useEffect(() => {
        const now = new Date();
        if (formData.timeFormat === 'UTC') {
            setFormData(prev => ({
                ...prev,
                hour: String(now.getUTCHours()),
                minute: String(now.getUTCMinutes())
            }));
        } else if (formData.timeFormat === '24') {
            setFormData(prev => ({
                ...prev,
                hour: String(now.getHours()),
                minute: String(now.getMinutes())
            }));
        } else if (formData.timeFormat === '12') {
            let h = now.getHours();
            const m = now.getMinutes();
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12; // 0 becomes 12
            setFormData(prev => ({
                ...prev,
                hour: String(h),
                minute: String(m),
                ampm
            }));
        }
    }, [formData.timeFormat]);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Cloud Layers
    // const addLayer = ... (Removed specific dynamic add logic)
    // const removeLayer = ...

    const updateLayer = (id: number, field: keyof CloudLayer, value: string) => {
        setCloudLayers(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    // Past Weather Logic: PW1 >= PW2
    useEffect(() => {
        const pw1 = parseInt(formData.pastWeather1);
        const pw2 = parseInt(formData.pastWeather2);

        if (!isNaN(pw1) && !isNaN(pw2) && pw2 > pw1) {
            setFormData(prev => ({ ...prev, pastWeather2: prev.pastWeather1 }));
        }
    }, [formData.pastWeather1, formData.pastWeather2]);

    // --- Generation Logic ---
    const generateMessage = () => {
        // Clear previous status
        setStatusMessage(null);

        // Validation Logic - Ordered visually by DOM position (Top to Bottom)
        const required: { name: string; label: string }[] = [
            { name: 'station', label: 'Select Station' },
            { name: 'synopTime', label: 'Synop Observation Time (UTC)' },
            { name: 'slp', label: 'SLP' },
            { name: 'mslp', label: 'MSLP' },
            { name: 'pressureChange', label: 'Pressure Change' },
            { name: 'dryBulb', label: 'Dry Bulb Temperature' },
        ];

        if (['03', '12'].includes(formData.synopTime)) {
            required.push({ name: 'maxTemp', label: 'Max Temperature' });
        }
        if (formData.synopTime === '03') {
            required.push({ name: 'minTemp', label: 'Min Temperature' });
        }

        required.push(
            { name: 'dewPoint', label: 'Dew Point' },
            { name: 'windDirection', label: 'Wind Direction' },
            { name: 'windSpeed', label: 'Wind Speed' },
            { name: 'visibility', label: 'Visibility Code' },
            { name: 'rfSinceLastObs', label: 'Rainfall Upto Current Obs' }
        );

        if (formData.synopTime === '03') {
            required.push(
                { name: 'rf0830to0830', label: 'Rainfall (24h)' },
                { name: 'seasonalRF', label: 'Seasonal Rainfall' }
            );
        }

        for (const field of required) {
            // Check if empty string or unselected
            if (!formData[field.name as keyof SynopFormData]) {
                setStatusMessage({ text: `${field.label} is required!`, type: 'error' });
                // Find element by name attribute securely
                const el = document.querySelector(`[name="${field.name}"]`) as HTMLElement;
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.focus({ preventScroll: true });
                    // Add blink class
                    el.classList.add(styles.blinkError);
                    setTimeout(() => el.classList.remove(styles.blinkError), 1000);
                }
                return ""; // Return empty string to abort
            }
        }

        const data = formData;
        // Extract station code if in "Name [Code]" format
        const stationCode = data.station.match(/\[(\d{5})\]/)?.[1] || data.station;

        const synopTime = data.synopTime;
        const dateObj = new Date(data.observationDate);
        let day = dateObj.getDate();

        if (synopTime === "21") {
            const prevDate = new Date(dateObj);
            prevDate.setDate(day - 1);
            day = prevDate.getDate();
        }
        const formattedDay = pad(day, 2);
        const randomNumber = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        const headerType = ["03", "09", "15", "21"].includes(synopTime) ? "SIIN90" : "SMIN90";

        // Section 1
        let rainStatus = "3";
        const rfValStr = data.rfSinceLastObs ? data.rfSinceLastObs.toLowerCase().trim() : "0";
        if (rfValStr === 't' || (parseFloat(rfValStr) > 0)) rainStatus = "2";

        const wxStatus = data.presentWeather === "" ? "2" : "1";
        const cloudHeight = data.lowestLayerHeight || "/";
        const visibilityCode = data.visibility || "96";
        const cloudAmount = data.totalCloudAmount || "/";
        const wd = data.windDirection || "00";
        const ws = pad(parseInt(data.windSpeed) || 0, 2);

        const dbVal = parseFloat(data.dryBulb);
        const DBH = dbVal >= 0 ? "10" : "11";
        const DB = isNaN(dbVal) ? "///" : pad(Math.abs(dbVal * 10).toFixed(0), 3);

        const dpVal = parseFloat(data.dewPoint);
        const DPH = dpVal >= 0 ? "20" : "21";
        const DP = isNaN(dpVal) ? "///" : pad(Math.abs(dpVal * 10).toFixed(0), 3);

        const slpVal = parseFloat(data.slp);
        const slpGroup = stationCode === "42542" && !isNaN(slpVal) ? `3${pad(Math.abs(slpVal * 10).toFixed(0), 5).slice(-4)} ` : "";

        const mslpVal = parseFloat(data.mslp);
        const mslpGroup = !isNaN(mslpVal) ? `4${pad(Math.abs(mslpVal * 10).toFixed(0), 5).slice(-4)} ` : "4//// ";

        let prwxGroup = "";
        if (data.presentWeather) {
            // Extract code if format is "00 - Label"
            const prWxCode = data.presentWeather.split(' ')[0] || "00";
            // Ensure we strictly only produce this group if there is a valid present weather code selected
            if (prWxCode) {
                const prwx = pad(prWxCode, 2);
                const past1 = (data.pastWeather1 || "0").split(' ')[0]; // Extract code only
                const past2 = (data.pastWeather2 || "0").split(' ')[0]; // Extract code only
                const pastwx = `${past1}${past2}`;
                prwxGroup = `7${prwx}${pastwx} `;
            }
        }

        let cloudGroup = "";
        if (data.totalCloudAmount !== "0" && data.totalCloudAmount !== "9") {
            let nh = data.lowCloudAmount || '0';
            if (nh === '0' && data.mediumCloudAmount && data.mediumCloudAmount !== '0') {
                nh = data.mediumCloudAmount;
            }
            cloudGroup = `8${nh}${data.lowCloudForm || 0}${data.mediumCloudForm || 0}${data.highCloudForm || 0} `;
        }

        // 333 Section
        let section333 = "333";
        if (synopTime === "03" || synopTime === "12") {
            const maxT = parseFloat(data.maxTemp);
            if (!isNaN(maxT)) {
                section333 += ` 1${maxT >= 0 ? '0' : '1'}${pad(Math.abs(maxT * 10).toFixed(0), 3)}`;
            }
        }
        if (synopTime === "03") {
            const minT = parseFloat(data.minTemp);
            if (!isNaN(minT)) {
                section333 += ` 2${minT >= 0 ? '0' : '1'}${pad(Math.abs(minT * 10).toFixed(0), 3)}`;
            }
        }

        // Pressure Change
        const prVal = parseFloat(data.pressureChange || '0');
        const prChangeType = prVal >= 0 ? "8" : "9";
        const prAbsVal = pad((Math.abs(prVal) * 10).toFixed(0), 3);
        const pressureSection = ` 5${prChangeType}${prAbsVal}`;

        // Rainfall
        let rfGroup = "";
        if (rainStatus === "2") {
            if (rfValStr === 't') {
                rfGroup = " 6990/";
            } else {
                const val = parseFloat(rfValStr);
                if (!isNaN(val)) {
                    if (val > 0 && val < 1.0) {
                        rfGroup = ` 699${Math.floor(val * 10)}/`;
                    } else if (val >= 1.0) {
                        let amt = Math.floor(val);
                        if ((val - amt) > 0.5) amt += 1; // Round custom logic?
                        else if (Math.abs((val - amt) - 0.5) < 0.001 && amt % 2 === 0) amt += 1;
                        rfGroup = ` 6${pad(amt, 3)}/`;
                    }
                }
            }
        }

        // Layers
        let layersCode = "";
        if (cloudGroup !== "") {
            for (const l of cloudLayers) {
                // If in a layer all values are zero then dont show this layer and above layers in synop message code.
                const isAllZero = l.amount === '0' && (l.form === '0' || l.form === '') && (l.height === '00' || l.height === '');
                if (isAllZero) break;

                if (l.amount && l.form && l.height && l.amount !== '/') {
                    layersCode += ` 8${l.amount}${l.form}${l.height}`;
                }
            }
        }

        // 555 Section (03Z only)
        let section555 = "";
        if (synopTime === "03") {
            section555 = " 555";

            // 0 - 24h Rainfall (0830-0830): 0 + (val * 10) padded to 4
            // Logic Change: If value is 000.0, do NOT show 00000. Only show 00000 for Trace ('t').
            if (data.rf0830to0830 === 't') {
                section555 += " 00000";
            } else {
                const rf24Val = parseFloat(data.rf0830to0830);
                if (!isNaN(rf24Val) && rf24Val > 0) {
                    const rf24Code = Math.round(rf24Val * 10).toString().padStart(4, '0');
                    section555 += ` 0${rf24Code}`;
                }
            }

            // 1 - Seasonal Rainfall: 1 + roundHalfToOdd(val) padded to 4
            if (data.seasonalRF === 't') {
                section555 += " 10000";
            } else {
                const rfSeasonalVal = parseFloat(data.seasonalRF);
                if (!isNaN(rfSeasonalVal)) {
                    let amt = Math.floor(rfSeasonalVal);
                    const frac = rfSeasonalVal - amt;
                    if (frac > 0.5) amt += 1;
                    else if (Math.abs(frac - 0.5) < 0.001 && amt % 2 === 0) amt += 1;

                    const seasonalCode = amt.toString().padStart(4, '0');
                    section555 += ` 1${seasonalCode}`;
                }
            }
        }

        let msg = `ZCZC ${randomNumber}\n`;
        msg += `${headerType} VIJP ${formattedDay}${synopTime}00\n`;
        msg += `AAXX ${formattedDay}${synopTime}4\n`;
        msg += `${stationCode} ${rainStatus}${wxStatus}${cloudHeight}${visibilityCode} ${cloudAmount}${wd}${ws} ${DBH}${DB} ${DPH}${DP} ${slpGroup}${mslpGroup}${prwxGroup}${cloudGroup}${section333}${pressureSection}${rfGroup}${layersCode}${section555}\n`;
        msg += `NNNN`;

        // Add extra message for 03 and 12 UTC
        if (synopTime === "03" || synopTime === "12") {
            const nextNumber = pad(parseInt(randomNumber) + 1, 2);
            msg += `\nZCZC ${nextNumber}\n`;
            msg += `SXIN90 VIJP ${formattedDay}${synopTime}00\n`;
            msg += `${stationCode} RH = ${data.relativeHumidity}%${synopTime === '12' ? ' RH MAX = %  RH MIN = %' : ''}\n`;
            msg += `NNNN`;
        }

        setMessage(msg);
    };

    return (
        <div className={styles.calculatorContainer}>
            <form className={styles.mmrForm} onSubmit={(e) => { e.preventDefault(); generateMessage(); }}>

                <div className={styles.topHeaderGrid}>
                    {/* Station */}
                    <section className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Station</h3>
                        <div className={styles.formGrid}>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Select Station (Search by Name or Code)</label>
                                <div className={styles.searchContainer} ref={stationRef}>
                                    <input
                                        type="text"
                                        name="station"
                                        value={formData.station}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setBypassStationFilter(false);
                                            setShowStationDropdown(true);
                                        }}
                                        onFocus={(e) => {
                                            e.target.select();
                                            setShowStationDropdown(true);
                                        }}
                                        placeholder="Type code or name..."
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        className={styles.dropdownToggle}
                                        onClick={() => {
                                            setBypassStationFilter(true);
                                            setShowStationDropdown(!showStationDropdown);
                                        }}
                                        tabIndex={-1}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                    {showStationDropdown && (
                                        <div className={styles.dropdownList}>
                                            {Object.entries(STATION_NAMES)
                                                .filter(([code, name]) => {
                                                    if (bypassStationFilter) return true;
                                                    const search = formData.station.toLowerCase();
                                                    // Show everything if empty or if searching for exactly what's selected
                                                    if (!search || search === `${name} [${code}]`.toLowerCase() || search === code.toLowerCase()) return true;
                                                    return name.toLowerCase().includes(search) || code.includes(search);
                                                })
                                                .map(([code, name]) => (
                                                    <div
                                                        key={code}
                                                        className={styles.dropdownItem}
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, station: `${name} [${code}]` }));
                                                            setShowStationDropdown(false);
                                                        }}
                                                    >
                                                        {name} [{code}]
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Synop Observation Time (UTC)</label>
                                <SearchableDropdown
                                    name="synopTime"
                                    value={formData.synopTime}
                                    options={['00', '03', '06', '09', '12', '15', '18', '21'].map(t => ({ value: t, label: `${t}00 UTC` }))}
                                    onChange={(e) => handleChange(e as any)}
                                    placeholder="Select Time"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Date & Time */}
                    <section className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Date & Time</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup} style={{ gridColumn: 'span 1' }}>
                                <label>Select Date</label>
                                <div
                                    className={styles.timeDropdown}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', cursor: 'pointer', background: 'var(--bg-primary)' }}
                                    onClick={() => dateInputRef.current?.showPicker()}
                                >
                                    <span>
                                        {formData.observationDate.split('-').reverse().join('/')}
                                    </span>
                                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--primary)' }}>
                                        📅
                                    </button>
                                    <input
                                        type="date"
                                        ref={dateInputRef}
                                        name="observationDate"
                                        value={formData.observationDate}
                                        onChange={handleChange}
                                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup} style={{ gridColumn: 'span 1' }}>
                                <label>Time Format</label>
                                <SearchableDropdown
                                    name="timeFormat"
                                    value={formData.timeFormat}
                                    options={[
                                        { value: '12', label: '12 Hour' },
                                        { value: '24', label: '24 Hour' },
                                        { value: 'UTC', label: 'UTC (GMT)' }
                                    ]}
                                    onChange={(e) => handleChange(e as any)}
                                    placeholder="Select Format"
                                />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Select Time</label>
                                <div className={styles.timeSelector} style={{ flexWrap: 'nowrap', display: 'flex', width: '100%', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <SearchableDropdown
                                            name="hour"
                                            value={String(formData.hour)}
                                            scrollToSelected={false}
                                            options={(() => {
                                                const is12h = formData.timeFormat === '12';
                                                const length = is12h ? 12 : 24;
                                                const base = Array.from({ length }, (_, i) => {
                                                    const val = is12h ? (i === 0 ? 12 : i) : i;
                                                    return { value: String(val), label: String(val).padStart(2, '0') };
                                                });
                                                const currentVal = String(formData.hour);
                                                const idx = base.findIndex(o => o.value === currentVal);
                                                if (idx === -1) return base;
                                                return [...base.slice(idx + 1), ...base.slice(0, idx + 1)];
                                            })()}
                                            onChange={(e) => handleChange(e as any)}
                                            placeholder="HH"
                                        />
                                    </div>
                                    <span className={styles.timeSeparator} style={{ alignSelf: 'center', fontWeight: 'bold' }}>:</span>
                                    <div style={{ flex: 1 }}>
                                        <SearchableDropdown
                                            name="minute"
                                            value={String(formData.minute)}
                                            scrollToSelected={false}
                                            options={(() => {
                                                const base = Array.from({ length: 60 }, (_, i) => ({ value: String(i), label: String(i).padStart(2, '0') }));
                                                const currentVal = String(formData.minute);
                                                const idx = base.findIndex(o => o.value === currentVal);
                                                if (idx === -1) return base;
                                                return [...base.slice(idx + 1), ...base.slice(0, idx + 1)];
                                            })()}
                                            onChange={(e) => handleChange(e as any)}
                                            placeholder="MM"
                                        />
                                    </div>
                                    {formData.timeFormat === '12' && (
                                        <div style={{ width: '100px' }}>
                                            <SearchableDropdown
                                                name="ampm"
                                                value={formData.ampm}
                                                options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]}
                                                onChange={(e) => handleChange(e as any)}
                                                placeholder="AM/PM"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Barometer & Temp */}
                <div className={styles.twoColumnSection}>
                    <section className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Barometer</h3>
                        <div className={`${styles.formGrid} ${styles.singleColumn}`}>

                            <div className={styles.formGroup}>
                                <label>Station Level Pressure (SLP)</label>
                                <input type="number" step="0.1" name="slp" value={formData.slp} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mean Sea Level Pressure (MSLP)</label>
                                <input type="number" step="0.1" name="mslp" value={formData.mslp} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Pressure Change</label>
                                <input type="number" step="0.1" name="pressureChange" value={formData.pressureChange} onChange={handleChange} />
                            </div>
                        </div>
                    </section>

                    <section className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Temperature</h3>
                        <div className={`${styles.formGrid} ${styles.singleColumn}`}>
                            <div className={styles.formGroup}>
                                <label>Dry Bulb Temp. (°C)</label>
                                <input type="number" step="0.1" name="dryBulb" value={formData.dryBulb} onChange={handleChange} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Max. Temp (°C) {formData.synopTime !== '03' && formData.synopTime !== '12' && '(Locked)'}</label>
                                <input type="number" step="0.1" name="maxTemp" value={formData.maxTemp} onChange={handleChange} disabled={formData.synopTime !== '03' && formData.synopTime !== '12'} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Min. Temp (°C) {formData.synopTime !== '03' && '(Locked)'}</label>
                                <input type="number" step="0.1" name="minTemp" value={formData.minTemp} onChange={handleChange} disabled={formData.synopTime !== '03'} />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Humidity & Wind */}
                <div className={styles.twoColumnSection}>
                    <section className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Humidity</h3>
                        <div className={`${styles.formGrid} ${styles.singleColumn}`}>
                            <div className={styles.formGroup}>
                                <label>Dew Point (DP) (°C)</label>
                                <input type="number" step="0.1" name="dewPoint" value={formData.dewPoint} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Relative Humidity (RH) (%)</label>
                                <input type="number" name="relativeHumidity" value={formData.relativeHumidity} onChange={handleChange} />
                            </div>

                        </div>
                    </section>

                    <section className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Wind & Visibility</h3>
                        <div className={`${styles.formGrid} ${styles.singleColumn}`}>
                            <div className={styles.formGroup} style={{ gridColumn: 'span 1' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Wind Direction</label>
                                        <SearchableDropdown
                                            name="windDirection"
                                            value={formData.windDirection}
                                            options={WIND_DIRECTION_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            placeholder="Select Direction"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Wind Speed</label>
                                        <input
                                            type="number"
                                            name="windSpeed"
                                            value={formData.windSpeed}
                                            onChange={handleChange}
                                            min="0" max="99" step="1"
                                            placeholder="Knots (00-99)"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.formGroup} style={{ gridColumn: 'span 1' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Visibility in Meters</label>
                                        <input
                                            type="number"
                                            name="manualVisibility"
                                            value={formData.manualVisibility}
                                            onChange={handleChange}
                                            placeholder="Meters"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Visibility code</label>
                                        <SearchableDropdown
                                            name="visibility"
                                            value={formData.visibility}
                                            options={VISIBILITY_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            placeholder="Select Visibility"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Clouds */}
                {/* Clouds & Layers - Side by Side */}
                <div className={styles.twoColumnSection}>
                    <section className={styles.formSection}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Clouds</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['skc', 'cp', 'so'].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, cloudStatus: status as any }))}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '4px',
                                            border: '1px solid var(--primary)',
                                            background: formData.cloudStatus === status ? 'var(--primary)' : 'transparent',
                                            color: formData.cloudStatus === status ? '#fff' : 'var(--primary)',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {status === 'skc' ? 'Sky is Clear' : status === 'cp' ? 'Clouds Present' : 'Sky Obscured'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.cloudGrid}> {/* Renamed or just use container logic */}
                            {/* Low Clouds */}
                            <div className={styles.cloudLayer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 'bold' }}>Low Clouds</div>
                                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem' }}>Form</label>
                                        <SearchableDropdown
                                            name="lowCloudForm"
                                            value={formData.lowCloudForm}
                                            options={LOW_CLOUD_FORM_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            disabled={formData.cloudStatus !== 'cp'}
                                            placeholder="Select"
                                        />
                                    </div>
                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem' }}>Amount</label>
                                        <SearchableDropdown
                                            name="lowCloudAmount"
                                            value={formData.lowCloudAmount}
                                            options={CLOUD_AMOUNT_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            disabled={formData.cloudStatus !== 'cp'}
                                            placeholder="Select"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Medium Clouds */}
                            <div className={styles.cloudLayer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 'bold' }}>Med. Clouds</div>
                                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem' }}>Form</label>
                                        <SearchableDropdown
                                            name="mediumCloudForm"
                                            value={formData.mediumCloudForm}
                                            options={MEDIUM_CLOUD_FORM_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            disabled={formData.cloudStatus !== 'cp'}
                                            placeholder="Select"
                                        />
                                    </div>
                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem' }}>Amount</label>
                                        <SearchableDropdown
                                            name="mediumCloudAmount"
                                            value={formData.mediumCloudAmount}
                                            options={CLOUD_AMOUNT_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            disabled={formData.cloudStatus !== 'cp'}
                                            placeholder="Select"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* High Clouds */}
                            <div className={styles.cloudLayer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 'bold' }}>High Clouds</div>
                                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem' }}>Form</label>
                                        <SearchableDropdown
                                            name="highCloudForm"
                                            value={formData.highCloudForm}
                                            options={HIGH_CLOUD_FORM_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            disabled={formData.cloudStatus !== 'cp'}
                                            placeholder="Select"
                                        />
                                    </div>
                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem' }}>Amount</label>
                                        <SearchableDropdown
                                            name="highCloudAmount"
                                            value={formData.highCloudAmount}
                                            options={CLOUD_AMOUNT_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            disabled={formData.cloudStatus !== 'cp'}
                                            placeholder="Select"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* General */}
                            <div className={styles.cloudLayer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 'bold' }}>Total & Height</div>
                                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem' }}>Total Amount</label>
                                        <SearchableDropdown
                                            name="totalCloudAmount"
                                            value={formData.totalCloudAmount}
                                            options={CLOUD_AMOUNT_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            disabled={formData.cloudStatus === 'skc'}
                                            placeholder="Select"
                                        />
                                    </div>
                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem' }}>Lowest Height</label>
                                        <SearchableDropdown
                                            name="lowestLayerHeight"
                                            value={formData.lowestLayerHeight}
                                            options={CLOUD_HEIGHT_CODES}
                                            onChange={(e) => handleChange(e as any)}
                                            disabled={formData.cloudStatus === 'skc' || formData.cloudStatus === 'so'}
                                            placeholder="Select"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <section className={styles.formSection}>
                        <h4 className={styles.sectionTitle}>Individual Layers</h4>
                        {cloudLayers.map((layer, index) => {
                            const isLocked = formData.cloudStatus !== 'cp' || (index > 0 && cloudLayers[index - 1].amount === '0');
                            return (
                                <div key={layer.id} className={styles.cloudLayer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>Layer {layer.id}</div>
                                    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                        <div className={styles.formGroup} style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.8rem' }}>Form</label>
                                            <SearchableDropdown
                                                name={`layer_${layer.id}_form`}
                                                value={layer.form}
                                                options={CLOUD_FORM_CODES}
                                                onChange={(e) => updateLayer(layer.id, 'form', e.target.value)}
                                                disabled={isLocked}
                                                placeholder="Select"
                                            />
                                        </div>
                                        <div className={styles.formGroup} style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.8rem' }}>Amount</label>
                                            <SearchableDropdown
                                                name={`layer_${layer.id}_amount`}
                                                value={layer.amount}
                                                options={CLOUD_AMOUNT_CODES}
                                                onChange={(e) => updateLayer(layer.id, 'amount', e.target.value)}
                                                disabled={isLocked}
                                                placeholder="Select"
                                            />
                                        </div>
                                        <div className={styles.formGroup} style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.8rem' }}>Height</label>
                                            <SearchableDropdown
                                                name={`layer_${layer.id}_height`}
                                                value={layer.height}
                                                options={INDIVIDUAL_HEIGHT_CODES.filter(c => {
                                                    if (index === 0) return true;
                                                    if (c.value === "00") return true;
                                                    const prevHeight = parseInt(cloudLayers[index - 1].height);
                                                    return !isNaN(prevHeight) && parseInt(c.value) > prevHeight;
                                                })}
                                                onChange={(e) => updateLayer(layer.id, 'height', e.target.value)}
                                                disabled={isLocked}
                                                placeholder="Select"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                </div>

                <div className={styles.twoColumnSection}>
                    {/* Rainfall */}
                    <section className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Rainfall</h3>
                        <div className={`${styles.formGrid} ${styles.singleColumn}`}>
                            <div className={styles.formGroup}>
                                <label>RF Upto Current Observation (mm)</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input type="text" name="rfSinceLastObs" value={formData.rfSinceLastObs} onChange={handleChange} placeholder="e.g. 10.5 or t" style={{ flex: 1 }} />
                                    <button type="button" className={styles.traceBtn} onClick={() => setFormData(prev => ({ ...prev, rfSinceLastObs: 't' }))}>TRACE</button>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>RF 0830-0830 (24h) (mm) {formData.synopTime !== '03' && '(Locked)'}</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input type="text" name="rf0830to0830" value={formData.rf0830to0830} onChange={handleChange} disabled={formData.synopTime !== '03'} style={{ flex: 1 }} />
                                    <button type="button" className={styles.traceBtn} onClick={() => setFormData(prev => ({ ...prev, rf0830to0830: 't' }))} disabled={formData.synopTime !== '03'}>TRACE</button>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Seasonal RF (mm) {formData.synopTime !== '03' && '(Locked)'}</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input type="text" name="seasonalRF" value={formData.seasonalRF} onChange={handleChange} disabled={formData.synopTime !== '03'} style={{ flex: 1 }} />
                                    <button type="button" className={styles.traceBtn} onClick={() => setFormData(prev => ({ ...prev, seasonalRF: 't' }))} disabled={formData.synopTime !== '03'}>TRACE</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Weather */}
                    <section className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Present & Past Weather</h3>
                        <div className={`${styles.formGrid} ${styles.singleColumn}`}>
                            <div className={styles.formGroup}>
                                <label>Present Weather</label>
                                <div className={styles.searchContainer} ref={weatherRef}>
                                    <input
                                        type="text"
                                        name="presentWeather"
                                        value={formData.presentWeather}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setBypassWeatherFilter(false);
                                            setShowWeatherDropdown(true);
                                        }}
                                        onFocus={(e) => {
                                            e.target.select();
                                            setShowWeatherDropdown(true);
                                        }}
                                        placeholder="Type weather code or name..."
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        className={styles.dropdownToggle}
                                        onClick={() => {
                                            setBypassWeatherFilter(true);
                                            setShowWeatherDropdown(!showWeatherDropdown);
                                        }}
                                        tabIndex={-1}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                    {showWeatherDropdown && (
                                        <div className={styles.dropdownList}>
                                            {WEATHER_CODES
                                                .filter(c => {
                                                    if (bypassWeatherFilter) return true;
                                                    const search = formData.presentWeather.toLowerCase();
                                                    if (!search || search === `${c.value} - ${c.label}`.toLowerCase()) return true;
                                                    return c.label.toLowerCase().includes(search) || c.value.includes(search);
                                                })
                                                .map(c => (
                                                    <div
                                                        key={c.value}
                                                        className={styles.dropdownItem}
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, presentWeather: `${c.value} - ${c.label}` }));
                                                            setShowWeatherDropdown(false);
                                                        }}
                                                    >
                                                        {c.value} - {c.label}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Past Weather 1</label>
                                <div className={styles.searchContainer} ref={pastWeather1Ref}>
                                    <input
                                        type="text"
                                        name="pastWeather1"
                                        value={formData.pastWeather1 ? PAST_WEATHER_CODES.find(c => c.value === formData.pastWeather1)?.label || formData.pastWeather1 : ''}
                                        onChange={(e) => {
                                            // Handle text search? Actually, for these small lists, maybe we just filter?
                                            // The value in formData is the code (e.g. "0", "1").
                                            // But user sees Label.
                                            // If I type "Rain", I want to see "Rain".
                                            // So Input should be "Code - Label" or just Label? 
                                            // The Constant has: { value: "0", label: "0 – Cloud covering..." }
                                            // The present weather uses `setFormData(..., val: "Code - Label")` string format.
                                            // BUT `pastWeather1` in formData seems to store just the CODE currently (value={c.value}). 
                                            // Let's check `handleChange`. Standard Select stores `e.target.value` which is "0".
                                            // So `formData.pastWeather1` is likely just "0".
                                            // If I want to make it searchable, I should probably render the selected "Label" in input or allow typing.
                                            // However, changing formData structure might be risky if calculation depends on it.
                                            // Let's keep formData as just CODE.
                                            // But input value must be derived or managed separately if I want to type "Rain".
                                            // A simple approach: 
                                            // Input value = formData.pastWeather1 (if valid code) ? Full Label : Search Term.
                                            // We might need a separate search state if we want to type partials.
                                            // Let's just make it a filterable dropdown similar to others but careful with value.
                                            // Actually, the other dropdowns stored the FULL STRING in formData.station etc.
                                            // "00 - Cloud..."
                                            // Let's check if `pastWeather1` logic relies on it being just a number. 
                                            // PW2 logic: `parseInt(c.value) <= parseInt(formData.pastWeather1)`. 
                                            // If I change PW1 to "0 - Cloud...", parseInt("0 - Cloud...") works (0).
                                            // So storing "Code - Label" is probably fine and consistent.
                                            // Wait, the original select had `value={formData.pastWeather1}` (likely "0").
                                            // If I change it to "0 - Label", I must ensure `parseInt` still works everywhere.
                                            // `parseInt("0 - Label")` -> 0. `parseInt("1 - ...")` -> 1.
                                            // So it's safe to store the full string.

                                            // BUT, if I just want to show the label and strictly pick from list?
                                            // Let's try to match the pattern: User Types -> Filters List -> User Clicks -> Sets "Code - Label".
                                            handleChange(e); // This sets formData to typed text.
                                            setBypassPastWeather1Filter(false);
                                            setShowPastWeather1Dropdown(true);
                                        }}
                                        onFocus={(e) => {
                                            e.target.select();
                                            setShowPastWeather1Dropdown(true);
                                        }}
                                        placeholder="Select Past Weather 1"
                                        autoComplete="off"
                                        disabled={!formData.presentWeather}
                                    />
                                    <button
                                        type="button"
                                        className={styles.dropdownToggle}
                                        onClick={() => {
                                            setBypassPastWeather1Filter(true);
                                            setShowPastWeather1Dropdown(!showPastWeather1Dropdown);
                                        }}
                                        disabled={!formData.presentWeather}
                                        tabIndex={-1}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                    {showPastWeather1Dropdown && (
                                        <div className={styles.dropdownList}>
                                            {PAST_WEATHER_CODES
                                                .filter(c => {
                                                    if (!c.value) return false; // Skip "SELECT" placeholder if we have custom UI
                                                    if (bypassPastWeather1Filter) return true;
                                                    const search = formData.pastWeather1.toLowerCase();
                                                    // Match code or label
                                                    // Also match if current value is exactly this option
                                                    if (!search || search === c.label.toLowerCase() || search === c.value.toLowerCase()) return true;
                                                    // If stored value is "0", we arguably want to show "0 - ...".
                                                    // Actually, if we store just "0", search "0" matches.
                                                    // If we store "0 - Cloud...", search matches.
                                                    return c.label.toLowerCase().includes(search) || c.value.includes(search);
                                                })
                                                .map(c => (
                                                    <div
                                                        key={c.value}
                                                        className={styles.dropdownItem}
                                                        onClick={() => {
                                                            // We should stick to the format used by others: "Code - Label"?
                                                            // Or just Code? The existing uses Code. "0", "1".
                                                            // If I change to "0 - Label", I change the data format.
                                                            // Does calculation helper use strict equality? 
                                                            // `parseInt` is used in PW2 filter.
                                                            // Let's try to store just the VALUE (Code) but display Label?
                                                            // No, standard text input shows what is stored.
                                                            // If I want consistency, I should store "Code - Label" OR just accept that this input shows Code.
                                                            // The user said "Make... same as present weather". Present weather stores "Code - Label".
                                                            // So I SHOULD store "Code - Label".
                                                            setFormData(prev => ({ ...prev, pastWeather1: `${c.label}` })); // label already includes matches "0 - ..." format from updated Constants?
                                                            // Updated Constants: { value: "0", label: "0 – Cloud..." }
                                                            // So `c.label` is "0 – Cloud...". Perfect.
                                                            setShowPastWeather1Dropdown(false);
                                                        }}
                                                    >
                                                        {c.label}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Past Weather 2</label>
                                <div className={styles.searchContainer} ref={pastWeather2Ref}>
                                    <input
                                        type="text"
                                        name="pastWeather2"
                                        value={formData.pastWeather2} // Assuming we store Label/Code string here too
                                        onChange={(e) => {
                                            handleChange(e);
                                            setBypassPastWeather2Filter(false);
                                            setShowPastWeather2Dropdown(true);
                                        }}
                                        onFocus={(e) => {
                                            e.target.select();
                                            setShowPastWeather2Dropdown(true);
                                        }}
                                        placeholder="Select Past Weather 2"
                                        autoComplete="off"
                                        disabled={!formData.presentWeather || !formData.pastWeather1}
                                    />
                                    <button
                                        type="button"
                                        className={styles.dropdownToggle}
                                        onClick={() => {
                                            setBypassPastWeather2Filter(true);
                                            setShowPastWeather2Dropdown(!showPastWeather2Dropdown);
                                        }}
                                        disabled={!formData.presentWeather || !formData.pastWeather1}
                                        tabIndex={-1}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                    {showPastWeather2Dropdown && (
                                        <div className={styles.dropdownList}>
                                            {PAST_WEATHER_CODES
                                                .filter(c => {
                                                    // Logic: Must be <= PW1
                                                    if (!c.value) return false;
                                                    // Safe parse since PW1 might be "0 - Label"
                                                    const pw1Val = parseInt(formData.pastWeather1);
                                                    const currentVal = parseInt(c.value);
                                                    if (isNaN(pw1Val)) return true; // If PW1 not set effectively, show all? Or filtered?
                                                    // Actually if PW1 is set, we restrict.
                                                    if (currentVal > pw1Val) return false;

                                                    if (bypassPastWeather2Filter) return true;
                                                    const search = formData.pastWeather2.toLowerCase();
                                                    if (!search || search === c.label.toLowerCase()) return true;
                                                    return c.label.toLowerCase().includes(search) || c.value.includes(search);
                                                })
                                                .map(c => (
                                                    <div
                                                        key={c.value}
                                                        className={styles.dropdownItem}
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, pastWeather2: `${c.label}` }));
                                                            setShowPastWeather2Dropdown(false);
                                                        }}
                                                    >
                                                        {c.label}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {formData.synopTime === '03' && (
                    <section className={styles.formSection} style={{ marginTop: '2rem' }}>
                        <h3 className={styles.sectionTitle}>
                            Weather Timing
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className={styles.formGroup} style={{ maxWidth: '200px' }}>
                                <label>Time Format</label>
                                <SearchableDropdown
                                    name="weatherTimeFormat"
                                    value={weatherTimeFormat}
                                    options={[
                                        { value: '12', label: '12 Hour' },
                                        { value: '24', label: '24 Hour' },
                                        { value: 'UTC', label: 'UTC' }
                                    ]}
                                    onChange={(e) => setWeatherTimeFormat(e.target.value as any)}
                                    placeholder="Select Format"
                                />
                            </div>

                            {weatherTimings.map((timing) => (
                                <div key={timing.id} style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'flex-end',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderBottom: '1px solid #eee'
                                }}>
                                    <div className={styles.formGroup} style={{ flex: '2 1 250px', marginBottom: 0 }}>
                                        <label>Weather Code</label>
                                        <SearchableDropdown
                                            name={`timing_${timing.id}`}
                                            value={timing.weatherCode}
                                            options={WEATHER_CODES.map(c => ({
                                                value: c.value ? `${c.value} - ${c.label}` : '',
                                                label: c.value ? `${c.value} - ${c.label}` : c.label
                                            }))}
                                            onChange={(e) => updateTiming(timing.id, 'weatherCode', e.target.value)}
                                            placeholder="Type weather code or name..."
                                        />
                                    </div>

                                    <div className={styles.formGroup} style={{ flex: '1 1 200px', marginBottom: 0 }}>
                                        <label>Start Time</label>
                                        <WeatherTimeSelector
                                            value={timing.startTime}
                                            onChange={(val) => updateTiming(timing.id, 'startTime', val)}
                                            format={weatherTimeFormat}
                                        />
                                    </div>

                                    <div className={styles.formGroup} style={{ flex: '1 1 200px', marginBottom: 0 }}>
                                        <label>End Time</label>
                                        <WeatherTimeSelector
                                            value={timing.endTime}
                                            onChange={(val) => updateTiming(timing.id, 'endTime', val)}
                                            format={weatherTimeFormat}
                                        />
                                    </div>

                                    <div style={{ fontWeight: '600', minWidth: '80px', paddingBottom: '10px' }}>
                                        {getDurationString(timing.startTime, timing.endTime)}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeTiming(timing.id)}
                                        style={{ marginBottom: '5px' }}
                                        className={styles.traceBtn} // Using traceBtn style as fallback for a small action button, or inline simple style
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            <div>
                                <button
                                    type="button"
                                    onClick={addTiming}
                                    className={styles.traceBtn}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', width: 'auto' }}
                                >
                                    <span>+</span> Add Weather Timing
                                </button>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#555' }}>Timing Summary (per weather code)</h4>
                                {Object.keys(timingSummary).length === 0 ? (
                                    <div style={{ fontSize: '0.8rem', color: '#999' }}>No timings added.</div>
                                ) : (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {Object.entries(timingSummary).map(([code, totalMins]) => (
                                            <div key={code} style={{
                                                background: '#f0f9ff',
                                                border: '1px solid #bae6fd',
                                                borderRadius: '4px',
                                                padding: '0.3rem 0.6rem',
                                                fontSize: '0.85rem',
                                                color: '#0369a1'
                                            }}>
                                                Code <strong>{code}</strong>: {totalMins} mins
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                <div className={styles.actionButtons} style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Generate Synop</button>
                </div>

                {statusMessage && (
                    <div className={`${styles.statusMessage} ${styles[`status${statusMessage.type === 'success' ? 'Success' : statusMessage.type === 'error' ? 'Error' : 'Info'}`]}`}>
                        {statusMessage.text}
                    </div>
                )}

                {message && (
                    <section className={styles.formSection} style={{ marginTop: '2rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Generated SYNOP Message</h3>
                            <div className={styles.copyButtonContainer}>
                                <button
                                    type="button"
                                    className={styles.iconButton}
                                    onClick={() => {
                                        navigator.clipboard.writeText(message);
                                        setStatusMessage({ text: 'Message copied to clipboard', type: 'success' });
                                        setTimeout(() => setStatusMessage(null), 3000);
                                    }}
                                    title="Copy"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                                <span className={styles.tooltip}>Copy Message</span>
                            </div>
                        </div>
                        <textarea
                            readOnly
                            value={message}
                            className={styles.synopTextarea}
                            style={{ fontSize: '1.5rem', padding: '1rem' }}
                        ></textarea>
                    </section>
                )}

            </form>
        </div>
    );
};

export default SynopCalculator;
