import { motion } from "framer-motion";

export function PrincipleBadge({ label, icon }: { label: string; icon?: string }) {
  return (
    <motion.div
      className="principle-badge"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.3 }}
    >
      {icon && <span className="principle-badge__icon">{icon}</span>}
      <span>{label}</span>
    </motion.div>
  );
}
