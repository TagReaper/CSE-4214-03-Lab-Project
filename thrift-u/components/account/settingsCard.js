"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function SettingsCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  iconColor,
}) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`${color} p-3 rounded-lg`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
