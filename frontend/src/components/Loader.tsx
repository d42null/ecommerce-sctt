export default function Loader({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
    const sizeOutput = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    }[size];

    return (
        <div className="flex justify-center items-center p-4">
            <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeOutput}`}></div>
        </div>
    );
}

export function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>;
}
