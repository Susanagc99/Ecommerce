// Constantes de categorías y subcategorías
// Este archivo puede ser usado tanto en cliente como en servidor

export const CATEGORIES = {
    Gaming: [
        'Consoles',
        'Controllers & Joysticks',
        'Gaming Headsets',
        'Gaming Chairs & Desks',
        'Monitors & Graphics Cards'
    ],
    'Smart Devices': [
        'Smartwatches',
        'Fitness Bands',
        'Voice Assistants',
        'Smart Bulbs',
        'WiFi Security Cameras'
    ],
    'Audio & Video': [
        'Bluetooth Speakers',
        'Microphones',
        'Webcams',
        'Portable Projectors'
    ],
    'Computer Accessories': [
        'Mechanical Keyboards',
        'Mice & Mousepads',
        'Laptop Stands',
        'USB Hubs & Adapters'
    ],
    'Smartphone Accessories': [
        'Cables & Chargers',
        'Earbuds / Headphones',
        'Screen Protectors & Phone Cases',
        'Phone Stands & Holders',
        'Power Banks'
    ],
    'Innovation & Smart Gadgets': [
        'Mini Drones',
        'Educational Robots',
        'Office Gadgets',
        'USB Multi-Tools',
        'Virtual Reality Devices'
    ]
} as const;

// Type helpers
export type CategoryType = keyof typeof CATEGORIES;
export type SubcategoryType = typeof CATEGORIES[CategoryType][number];

