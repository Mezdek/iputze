import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { ReactNode } from "react";

export function Tile({ header, body, footer }: { header: ReactNode, body: ReactNode, footer: ReactNode }) {
    return (
        <Card>
            <CardHeader className="justify-between bg-warning-500 text-lg font-medium">
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
