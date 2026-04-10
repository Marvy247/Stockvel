import { motion } from 'framer-motion';

interface Props {
  icon?: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon = '🫙', title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-2xl p-12 border border-app-border text-center"
    >
      <p className="text-4xl mb-4">{icon}</p>
      <p className="font-bold text-xl mb-2">{title}</p>
      <p className="text-text-dim mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 rounded-xl bg-accent-indigo text-white font-medium hover:shadow-premium transition-all"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
