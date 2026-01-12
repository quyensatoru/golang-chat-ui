import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import {
    X, Package, CheckCircle2, XCircle, Clock, Plus, Trash2,
    Info, Sparkles, Globe, Image as ImageIcon, Database,
    CheckSquare, Square, ChevronDown, ArrowLeft
} from 'lucide-react';
import { api } from '../../lib/api';

// Environment variable presets
const ENV_PRESETS = {
    MONGODB_URI: {
        placeholder: 'mongodb://$(MONGODB_HOST):$(MONGODB_PORT)/mydb?retryWrites=true&w=majority',
        help: 'Complete MongoDB connection URI. Use $(MONGODB_HOST) for auto-generated service name',
        defaultValue: 'mongodb://$(MONGODB_HOST):$(MONGODB_PORT)/mydb?retryWrites=true&w=majority'
    },
    REDIS_URI: {
        placeholder: 'redis://$(REDIS_HOST):$(REDIS_PORT)',
        help: 'Complete Redis connection URI. Use $(REDIS_HOST) for auto-generated service name',
        defaultValue: 'redis://$(REDIS_HOST):$(REDIS_PORT)'
    },
    RABBITMQ_URI: {
        placeholder: 'amqp://$(RABBITMQ_USER):$(RABBITMQ_PASSWORD)@$(RABBITMQ_HOST):$(RABBITMQ_PORT)',
        help: 'Complete RabbitMQ connection URI with credentials. Use $(RABBITMQ_HOST) for auto-generated service name',
        defaultValue: 'amqp://$(RABBITMQ_USER):$(RABBITMQ_PASSWORD)@$(RABBITMQ_HOST):$(RABBITMQ_PORT)'
    },
    POSTGRESQL_URI: {
        placeholder: 'postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRESQL_HOST):$(POSTGRESQL_PORT)/$(POSTGRES_DB)',
        help: 'Complete PostgreSQL connection URI. Use $(POSTGRESQL_HOST) for auto-generated service name',
        defaultValue: 'postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRESQL_HOST):$(POSTGRESQL_PORT)/$(POSTGRES_DB)'
    },
    MYSQL_URI: {
        placeholder: 'mysql://$(MYSQL_USER):$(MYSQL_PASSWORD)@$(MYSQL_HOST):$(MYSQL_PORT)/$(MYSQL_DATABASE)',
        help: 'Complete MySQL connection URI. Use $(MYSQL_HOST) for auto-generated service name',
        defaultValue: 'mysql://$(MYSQL_USER):$(MYSQL_PASSWORD)@$(MYSQL_HOST):$(MYSQL_PORT)/$(MYSQL_DATABASE)'
    },
    ELASTICSEARCH_URI: {
        placeholder: 'http://$(ELASTICSEARCH_HOST):$(ELASTICSEARCH_PORT)',
        help: 'Complete Elasticsearch connection URI. Use $(ELASTICSEARCH_HOST) for auto-generated service name',
        defaultValue: 'http://$(ELASTICSEARCH_HOST):$(ELASTICSEARCH_PORT)'
    },
    MONGODB_HOST: {
        placeholder: '$(MONGODB_HOST)',
        help: 'MongoDB host address. Auto-generated service name',
        defaultValue: '$(MONGODB_HOST)'
    },
    MONGODB_PORT: {
        placeholder: '27017',
        help: 'MongoDB port number (default: 27017)',
        defaultValue: '27017'
    },
    MONGODB_DATABASE: {
        placeholder: 'mydb',
        help: 'MongoDB database name',
        defaultValue: 'mydb'
    },
    MONGO_USERNAME: {
        placeholder: 'admin',
        help: 'MongoDB root username (if auth is enabled)',
        defaultValue: 'admin'
    },
    MONGO_PASSWORD: {
        placeholder: 'password',
        help: 'MongoDB root password (if auth is enabled)',
        defaultValue: 'password'
    },
    REDIS_HOST: {
        placeholder: '$(REDIS_HOST)',
        help: 'Redis host address. Auto-generated service name',
        defaultValue: '$(REDIS_HOST)'
    },
    REDIS_PORT: {
        placeholder: '6379',
        help: 'Redis port number (default: 6379)',
        defaultValue: '6379'
    },
    RABBITMQ_HOST: {
        placeholder: '$(RABBITMQ_HOST)',
        help: 'RabbitMQ host address. Auto-generated service name',
        defaultValue: '$(RABBITMQ_HOST)'
    },
    RABBITMQ_PORT: {
        placeholder: '5672',
        help: 'RabbitMQ port number (default: 5672)',
        defaultValue: '5672'
    },
    RABBITMQ_USER: {
        placeholder: 'dev',
        help: 'RabbitMQ username (default: guest)',
        defaultValue: 'dev'
    },
    RABBITMQ_PASSWORD: {
        placeholder: 'Dev1234567',
        help: 'RabbitMQ password (default: Dev1234567)',
        defaultValue: 'Dev1234567'
    },
    POSTGRESQL_HOST: {
        placeholder: '$(POSTGRESQL_HOST)',
        help: 'PostgreSQL host address. Auto-generated service name',
        defaultValue: '$(POSTGRESQL_HOST)'
    },
    POSTGRESQL_PORT: {
        placeholder: '5432',
        help: 'PostgreSQL port number (default: 5432)',
        defaultValue: '5432'
    },
    POSTGRES_USER: {
        placeholder: 'postgres',
        help: 'PostgreSQL username (default: postgres)',
        defaultValue: 'postgres'
    },
    POSTGRES_PASSWORD: {
        placeholder: 'postgres',
        help: 'PostgreSQL password (default: postgres)',
        defaultValue: 'postgres'
    },
    POSTGRES_DB: {
        placeholder: 'postgres',
        help: 'PostgreSQL database name (default: postgres)',
        defaultValue: 'postgres'
    },
    MYSQL_HOST: {
        placeholder: '$(MYSQL_HOST)',
        help: 'MySQL host address. Auto-generated service name',
        defaultValue: '$(MYSQL_HOST)'
    },
    MYSQL_PORT: {
        placeholder: '3306',
        help: 'MySQL port number (default: 3306)',
        defaultValue: '3306'
    },
    MYSQL_USER: {
        placeholder: 'root',
        help: 'MySQL username (default: root)',
        defaultValue: 'root'
    },
    MYSQL_PASSWORD: {
        placeholder: 'root',
        help: 'MySQL password (default: root)',
        defaultValue: 'root'
    },
    MYSQL_DATABASE: {
        placeholder: 'mydb',
        help: 'MySQL database name (default: mydb)',
        defaultValue: 'mydb'
    },
    MYSQL_ROOT_PASSWORD: {
        placeholder: 'root',
        help: 'MySQL root password',
        defaultValue: 'root'
    },
    ELASTICSEARCH_HOST: {
        placeholder: '$(ELASTICSEARCH_HOST)',
        help: 'Elasticsearch host address. Auto-generated service name',
        defaultValue: '$(ELASTICSEARCH_HOST)'
    },
    ELASTICSEARCH_PORT: {
        placeholder: '9200',
        help: 'Elasticsearch port number (default: 9200)',
        defaultValue: '9200'
    },
    ELASTICSEARCH_USERNAME: {
        placeholder: 'elastic',
        help: 'Elasticsearch username (if security is enabled)',
        defaultValue: 'elastic'
    },
    ELASTICSEARCH_PASSWORD: {
        placeholder: 'changeme',
        help: 'Elasticsearch password (if security is enabled)',
        defaultValue: 'changeme'
    },
    NODE_ENV: {
        placeholder: 'production',
        help: 'Node.js environment (development, production, test)',
        defaultValue: 'production'
    },
    PORT: {
        placeholder: '3000',
        help: 'Application port number',
        defaultValue: '3000'
    },
};

const VariablePickerDropdown = ({ allPresets, onInsert, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({ service: true });

    const categorizePresets = () => {
        const categories = {
            service: [], uris: [], mongodb: [], redis: [],
            rabbitmq: [], postgresql: [], mysql: [],
            elasticsearch: [], common: []
        };

        Object.entries(allPresets).forEach(([key, preset]) => {
            const keyLower = key.toLowerCase();
            if (preset.isServiceURL) categories.service.push([key, preset]);
            else if (keyLower.includes('_uri')) categories.uris.push([key, preset]);
            else if (keyLower.includes('mongo')) categories.mongodb.push([key, preset]);
            else if (keyLower.includes('redis')) categories.redis.push([key, preset]);
            else if (keyLower.includes('rabbit')) categories.rabbitmq.push([key, preset]);
            else if (keyLower.includes('postgre') || keyLower.includes('postgres')) categories.postgresql.push([key, preset]);
            else if (keyLower.includes('mysql')) categories.mysql.push([key, preset]);
            else if (keyLower.includes('elastic')) categories.elasticsearch.push([key, preset]);
            else categories.common.push([key, preset]);
        });
        return categories;
    };

    const categories = categorizePresets();

    const filterPresets = (presetList) => {
        if (!searchTerm) return presetList;
        return presetList.filter(([key, preset]) =>
            key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            preset.help.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev => ({ ...prev, [categoryKey]: !prev[categoryKey] }));
    };

    const CategorySection = ({ title, icon, presets, categoryKey, color = 'blue' }) => {
        const filteredPresets = filterPresets(presets);
        if (filteredPresets.length === 0 && searchTerm) return null;
        const isExpanded = expandedCategories[categoryKey];

        return (
            <div className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                <button
                    type="button"
                    onClick={() => toggleCategory(categoryKey)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {title} ({filteredPresets.length})
                        </span>
                    </div>
                    <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                    <div className="pb-1">
                        {filteredPresets.map(([key, preset]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => { onInsert(key, preset.defaultValue); onClose(); }}
                                className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors group"
                            >
                                <div className="flex items-start gap-2">
                                    <div className={`mt-0.5 p-1 rounded bg-${color}-100 dark:bg-${color}-900/20`}>
                                        <Package className={`h-3 w-3 text-${color}-600 dark:text-${color}-400`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">{key}</div>
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{preset.help}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl z-50">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 space-y-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        Quick Variables
                    </h4>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <Input
                    type="text"
                    placeholder="Search variables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 text-xs border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                    autoFocus
                />
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
                {categories.service.length > 0 && <CategorySection title="Service URLs" icon="🔗" presets={categories.service} categoryKey="service" color="green" />}
                {categories.uris.length > 0 && <CategorySection title="Connection URIs" icon="🌐" presets={categories.uris} categoryKey="uris" color="indigo" />}
                {categories.mongodb.length > 0 && <CategorySection title="MongoDB" icon="🍃" presets={categories.mongodb} categoryKey="mongodb" color="green" />}
                {categories.redis.length > 0 && <CategorySection title="Redis" icon="⚡" presets={categories.redis} categoryKey="redis" color="red" />}
                {categories.rabbitmq.length > 0 && <CategorySection title="RabbitMQ" icon="🐰" presets={categories.rabbitmq} categoryKey="rabbitmq" color="orange" />}
                {categories.postgresql.length > 0 && <CategorySection title="PostgreSQL" icon="🐘" presets={categories.postgresql} categoryKey="postgresql" color="blue" />}
                {categories.mysql.length > 0 && <CategorySection title="MySQL" icon="🐬" presets={categories.mysql} categoryKey="mysql" color="blue" />}
                {categories.elasticsearch.length > 0 && <CategorySection title="Elasticsearch" icon="🔍" presets={categories.elasticsearch} categoryKey="elasticsearch" color="yellow" />}
                {categories.common.length > 0 && <CategorySection title="Common" icon="⚙️" presets={categories.common} categoryKey="common" color="slate" />}
            </div>
        </div>
    );
};

const SUB_SERVICES = [
    { id: 'rabbitmq', name: 'RabbitMQ', icon: '🐰', description: 'Message broker', color: 'from-orange-500 to-red-500' },
    { id: 'redis', name: 'Redis', icon: '⚡', description: 'In-memory cache', color: 'from-red-500 to-pink-500' },
    { id: 'mongodb', name: 'MongoDB', icon: '🍃', description: 'NoSQL database', color: 'from-green-500 to-emerald-500' },
    { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', description: 'SQL database', color: 'from-blue-500 to-indigo-500' },
    { id: 'mysql', name: 'MySQL', icon: '🐬', description: 'SQL database', color: 'from-blue-400 to-cyan-500' },
    { id: 'elasticsearch', name: 'Elasticsearch', icon: '🔍', description: 'Search engine', color: 'from-yellow-500 to-amber-500' },
];

const SubServiceSelector = ({ selectedServices = [], onUpdate }) => {
    const toggleService = (serviceId) => {
        const isSelected = selectedServices.includes(serviceId);
        onUpdate(isSelected ? selectedServices.filter(s => s !== serviceId) : [...selectedServices, serviceId]);
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {SUB_SERVICES.map((subService) => {
                const isSelected = selectedServices.includes(subService.id);
                return (
                    <button
                        key={subService.id}
                        type="button"
                        onClick={() => toggleService(subService.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-[1.02]'
                            : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subService.color} flex items-center justify-center text-xl flex-shrink-0 shadow-sm`}>
                                {subService.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{subService.name}</h4>
                                    {isSelected ? <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        : <Square className="h-4 w-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subService.description}</p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

const EnvironmentEditor = ({ service, index, onUpdate, onRemove, appName, allServices }) => {
    const textareaRef = React.useRef(null);
    const [showVariablePicker, setShowVariablePicker] = useState(false);
    const [jsonError, setJsonError] = useState('');

    const validateJSON = (value) => {
        try { if (value.trim()) JSON.parse(value); setJsonError(''); return true; }
        catch (error) { setJsonError(error.message); return false; }
    };

    const handleTextChange = (e) => {
        const value = e.target.value;
        onUpdate(index, 'env_raw', value);
        validateJSON(value);
    };

    const insertVariable = (varKey, varValue) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const currentValue = service.env_raw || '{}';
        try {
            const jsonObj = currentValue.trim() ? JSON.parse(currentValue) : {};
            jsonObj[varKey] = varValue;
            const newValue = JSON.stringify(jsonObj, null, 2);
            onUpdate(index, 'env_raw', newValue);
            setShowVariablePicker(false);
            validateJSON(newValue);
            setTimeout(() => textarea.focus(), 100);
        } catch (error) { console.error('Failed to insert variable:', error); }
    };

    const getDynamicServiceURLPresets = () => {
        if (!appName || !allServices || allServices.length === 0) return {};
        const appNameUpper = appName.toUpperCase();
        const presets = {};
        allServices.forEach(svc => {
            if (svc.name && svc.name.trim()) {
                const serviceNameUpper = svc.name.toUpperCase();
                const envKey = `${appNameUpper}_${serviceNameUpper}_URL`;
                presets[envKey] = {
                    placeholder: `$(${envKey})`,
                    help: `${svc.name} service URL in ${appName} app (auto-generated)`,
                    defaultValue: `$(${envKey})`,
                    isServiceURL: true
                };
            }
        });
        return presets;
    };

    const getAllPresets = () => ({ ...getDynamicServiceURLPresets(), ...ENV_PRESETS });

    const formatJSON = () => {
        try {
            const parsed = JSON.parse(service.env_raw || '{}');
            onUpdate(index, 'env_raw', JSON.stringify(parsed, null, 2));
            setJsonError('');
        } catch (error) { setJsonError('Invalid JSON - cannot format'); }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = e.target.value;
            const newValue = value.substring(0, start) + '  ' + value.substring(end);
            onUpdate(index, 'env_raw', newValue);
            setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2; }, 0);
        }
    };

    return (
        <div className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-xl relative bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/50 shadow-md hover:shadow-lg transition-all duration-200">
            <Button
                type="button" variant="ghost" size="sm"
                className="absolute top-4 right-4 text-slate-400 hover:text-red-600 dark:hover:text-red-400 h-9 w-9 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors z-10"
                onClick={() => onRemove(index)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <div className="mb-5 pr-12">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" /> Service Name
                </Label>
                <Input
                    value={service.name}
                    onChange={(e) => onUpdate(index, 'name', e.target.value)}
                    placeholder="e.g. backend, api, cms"
                    className="mt-1.5 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900"
                    required
                />
            </div>

            <div className="mb-5 p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-indigo-600" /> Docker Image Configuration
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">Image URL</Label>
                        <Input
                            value={service.image_url || ''}
                            onChange={(e) => onUpdate(index, 'image_url', e.target.value)}
                            placeholder="e.g. registry.example.com/app"
                            className="mt-1 text-sm border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                        />
                    </div>
                    <div>
                        <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">Image Tag</Label>
                        <Input
                            value={service.image_tag || 'latest'}
                            onChange={(e) => onUpdate(index, 'image_tag', e.target.value)}
                            placeholder="e.g. v1.0.0, latest"
                            className="mt-1 text-sm border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-5">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-600" /> Sub-Services Dependencies
                </Label>
                <SubServiceSelector
                    selectedServices={service.sub_services || []}
                    onUpdate={(newServices) => onUpdate(index, 'sub_services', newServices)}
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" /> Environment Variables (JSON)
                    </Label>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Button
                                type="button" variant="outline" size="sm"
                                onClick={() => setShowVariablePicker(!showVariablePicker)}
                                className="text-xs border-blue-300 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm"
                            >
                                <Plus className="h-3 w-3 mr-1" /> Insert Variable
                            </Button>
                            {showVariablePicker && (
                                <VariablePickerDropdown
                                    allPresets={getAllPresets()}
                                    onInsert={insertVariable}
                                    onClose={() => setShowVariablePicker(false)}
                                />
                            )}
                        </div>
                        <Button
                            type="button" variant="outline" size="sm"
                            onClick={formatJSON}
                            className="text-xs border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                            <Sparkles className="h-3 w-3 mr-1" /> Format
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={service.env_raw || '{}'}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        rows={12}
                        className={`w-full rounded-lg border ${jsonError ? 'border-red-300 dark:border-red-700' : 'border-slate-300 dark:border-slate-600'} bg-slate-900 dark:bg-slate-950 px-4 py-3 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${jsonError ? 'focus:ring-red-500' : 'focus:ring-blue-500'} resize-none scrollbar-thin`}
                    />
                </div>
                {jsonError && <div className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200">{jsonError}</div>}
            </div>
        </div>
    );
};

export default function AppCreatePage() {
    const navigate = useNavigate();
    const [servers, setServers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newApp, setNewApp] = useState({
        name: '', helm_chart: 'main', server_id: '', domain: '', services: [],
    });

    useEffect(() => {
        fetchServers();
    }, []);

    const fetchServers = async () => {
        try {
            const res = await api.fetch('/servers');
            const data = await res.json();
            if (data.data) setServers(data.data.filter(s => s.status === 'k8s_ready'));
        } catch (error) { console.error('Error fetching servers:', error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const transformedServices = newApp.services.map((svc) => ({
                name: svc.name,
                image_url: svc.image_url || '',
                image_tag: svc.image_tag || 'latest',
                sub_services: svc.sub_services || [],
                env_raw: JSON.stringify(JSON.parse(svc.env_raw || '{}')),
            }));
            newApp.server_id = +newApp.server_id
            const res = await api.post('/apps', { ...newApp, services: transformedServices });
            if (res.ok) navigate('/apps');
        } catch (error) { console.error('Error creating app:', error); }
        finally { setIsLoading(false); }
    };

    const updateService = (index, field, value) => {
        const updatedServices = [...newApp.services];
        updatedServices[index] = { ...updatedServices[index], [field]: value };
        setNewApp({ ...newApp, services: updatedServices });
    };

    const addService = () => {
        setNewApp({
            ...newApp,
            services: [...newApp.services, { name: '', image_url: '', image_tag: 'latest', sub_services: [], env_raw: '{}' }]
        });
    };

    const removeService = (index) => {
        setNewApp({ ...newApp, services: newApp.services.filter((_, i) => i !== index) });
    };

    return (
        <div>
            <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-150px)] overflow-y-auto no-scrollbar">
                <button
                    onClick={() => navigate('/apps')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Applications
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Deploy New Application</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Configure and deploy your application to Kubernetes</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-sm">
                            <CardTitle className="flex items-center gap-3">
                                <Package className="h-6 w-6" /> Application configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-semibold">Target Server</Label>
                                    <select
                                        className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                                        value={newApp.server_id}
                                        onChange={(e) => setNewApp({ ...newApp, server_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a server</option>
                                        {servers.map(server => <option key={server.id} value={server.id}>{server.name} ({server.ip_address})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Application Name</Label>
                                    <Input
                                        value={newApp.name}
                                        onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                                        placeholder="Enter application name"
                                        className="mt-1.5"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-semibold">Helm Chart branch</Label>
                                    <Input
                                        value={newApp.branch}
                                        onChange={(e) => setNewApp({ ...newApp, helm_chart: e.target.value })}
                                        placeholder="main"
                                        className="mt-1.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-blue-500" /> Domain configuration (Optional)
                                    </Label>
                                    <Input
                                        value={newApp.domain}
                                        onChange={(e) => setNewApp({ ...newApp, domain: e.target.value })}
                                        placeholder="e.g. app.example.com"
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-blue-600" /> Services Configuration
                            </h2>
                            <Button type="button" onClick={addService} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg hover:shadow-blue-500/20">
                                <Plus className="h-4 w-4" /> Add Service
                            </Button>
                        </div>

                        {newApp.services.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No services added yet</h3>
                                <p className="text-slate-500 mt-2">Add at least one service to deploy your application</p>
                                <Button type="button" onClick={addService} variant="outline" className="mt-6">Add your first service</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {newApp.services.map((service, index) => (
                                    <EnvironmentEditor
                                        key={index}
                                        index={index}
                                        service={service}
                                        appName={newApp.name}
                                        allServices={newApp.services}
                                        onUpdate={updateService}
                                        onRemove={removeService}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50">
                        <div className="max-w-6xl mx-auto w-full flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/apps')} className="px-8 flex-1 md:flex-none">Cancel</Button>
                            <Button
                                type="submit"
                                disabled={isLoading || newApp.services.length === 0}
                                className="px-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/20 flex-1 md:flex-none"
                            >
                                {isLoading ? 'Deploying...' : 'Deploy Application'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
