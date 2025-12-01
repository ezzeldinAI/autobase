"use client";

import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";

export const AddNodeButton = memo(() => (
  <Button
    className="bg-background"
    // onClick={() => {}}
    size="icon-sm"
    variant="outline"
  >
    <PlusIcon />
  </Button>
));

AddNodeButton.displayName = "AddNodeButton";
