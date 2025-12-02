import { RetroGrid } from "@/components/ui/shadcn-io/retro-grid";

export default function AuthLayout({
    children,
}:  Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="signuplogin relative min-h-screen w-full overflow-hidden">
            <RetroGrid className="absolute inset-0 z-0" />
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    )
}