export default function AuthLayout({
    children,
}:  Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="signuplogin">
            {children}
        </div>
    )
}