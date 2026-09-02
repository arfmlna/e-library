import React from 'react';

export default function RoleSelector({ roleType, setRoleType }) {
    return (
        <div className="fieldset p-0">
            <label className="fieldset-legend font-semibold mb-2 text-base-content/80 select-none">Saya mendaftar sebagai:</label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setRoleType('student')}
                    className={`py-3.5 text-sm font-bold rounded-xl border text-center transition-all duration-200 ${
                        roleType === 'student'
                            ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm'
                            : 'border-base-300 bg-base-100 text-base-content/70 hover:bg-base-200 hover:text-base-content'
                    }`}
                >
                    🎓 Student
                </button>
                <button
                    type="button"
                    onClick={() => setRoleType('teacher')}
                    className={`py-3.5 text-sm font-bold rounded-xl border text-center transition-all duration-200 ${
                        roleType === 'teacher'
                            ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm'
                            : 'border-base-300 bg-base-100 text-base-content/70 hover:bg-base-200 hover:text-base-content'
                    }`}
                >
                    👨‍🏫 Teacher
                </button>
            </div>
        </div>
    );
}
