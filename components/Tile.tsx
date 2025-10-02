'use client'
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import type { ReactNode } from "react";


export function Tile({ header, body, footer }: { header: ReactNode, body: ReactNode, footer: ReactNode }) {
    return (
        <Card>
            <CardHeader className="justify-between text-lg font-medium bg-secondary-300">
                {header}
            </CardHeader>
            <CardBody className="gap-1">
                {body}
            </CardBody>
            <CardFooter className="gap-2">
                {footer}
            </CardFooter>
        </Card>
    )
}
