'use client';
import { FaMoon, FaSun } from "react-icons/fa";

type ToggleDayNightProps = {
    day: boolean;
    toggle: () => void;
};

export default function ToggleDayNight({ day, toggle }: ToggleDayNightProps) {
    return (
        <button
            type="button"
            onClick={toggle}
            className="bg-yellow-600 p-1 border-solid rounded text-white hover:bg-yellow-700 transition duration-300 shadow-md"
        >
            {day ? <FaMoon className="pixelated" /> : <FaSun className="pixelated" />}
        </button>
    );
}
