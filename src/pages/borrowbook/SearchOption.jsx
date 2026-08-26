import { useEffect, useRef, useState } from "react";

const SearchOption = ({ 
    name, 
    users, 
    searchTerm, 
    setSearchTerm,
    displayField,
    required = false, 
    defaultValueId = "", 
    defaultValueName = "" 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        if (defaultValueId && defaultValueName) {
        setSelectedId(defaultValueId);
        setSearchTerm(defaultValueName);
        }
    }, [defaultValueId, defaultValueName, setSearchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full flex flex-col gap-1">
        <input
            className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black'
            type="text"
            placeholder={`Search ${name}...`}
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value)
                setSelectedId('')
            }}
            onFocus={() => setIsOpen(true)}
        />
            <select className='absolute pointer-events-none opacity-0 w-0 h-0'
            name={name}
            id={name}
            value={selectedId}
            required={required}
            onChange={(e) => setSelectedId(e.target.value)}
            >
                <option value="">-- select --</option>
                {selectedId && !users?.items?.some(item => item.id === selectedId) && (
                    <option value={selectedId}>{searchTerm}</option>
                )}
                {users?.items?.map((item, index) => (
                <option
                    key={index}
                    value={item?.id}
                    className='p-2.5 cursor-pointer'
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                >
                    {item[displayField]}
                </option>
                ))}
            </select>

            {isOpen && users?.items?.length > 0 && (
                <ul className='absolute z-50 w-full max-h-32 overflow-auto bg-white border border-gray-300 top-9 rounded-sm shadow-md'>
                {users?.items?.map((item, index) => {
                    const displayText = item[displayField] || '';
                    return (
                    <li
                        key={item?.id || index}
                        onClick={() => {
                        setSearchTerm(displayText);
                        setSelectedId(item?.id || '');
                        setIsOpen(false);
                        }}
                        className='p-2.5 text-sm cursor-pointer text-black bg-white hover:bg-gray-100 text-left'
                    >
                        {displayText} {item['role'] && ` - ${item['role']}`}
                    </li>
                    );
                })}
                </ul>
            )}
        </div>
    );
};

export default SearchOption