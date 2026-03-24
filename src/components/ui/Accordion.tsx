'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export type AccordionItem = {
  id: string | number;
  header: React.ReactNode;
  content: React.ReactNode;
  rightContent?: React.ReactNode; // 👈 for switch or actions
};

type AccordionProps = {
  items: AccordionItem[];
  allowMultiple?: boolean;
};

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<(string | number)[]>([]);

  const toggleItem = (id: string | number) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div key={item.id} className="border rounded-lg overflow-hidden">

            {/* Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex items-center gap-3">
                {item.header}
              </div>

              <div className="flex items-center gap-3">
                {/* Right side custom content (Switch etc.) */}
                {item.rightContent}

                {/* Expand Icon */}
                {/* <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.div> */}
              </div>
            </div>

            {/* Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        );
      })}
    </div>
  );
}