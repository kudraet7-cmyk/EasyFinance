import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MacScanSweeperProps {
  isScanning: boolean;
  targetArea?: { width: number; height: number } | null;
}

export const MacScanSweeper: React.FC<MacScanSweeperProps> = ({
  isScanning
}) => {
  return (
    <AnimatePresence>
      {isScanning && (
        <motion.div
          key="mac-scan-sweeper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none"
        >
          {/* Futuristic Optical Precision Laser Sweep (Crystal-clear, zero milky blur) */}
          <motion.div
            initial={{ y: '-5%' }}
            animate={{ y: '105vh' }}
            transition={{
              duration: 0.68,
              ease: [0.25, 1, 0.5, 1]
            }}
            className="absolute inset-x-0 h-12 pointer-events-none flex flex-col justify-end"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 122, 255, 0) 0%, rgba(0, 122, 255, 0.08) 70%, rgba(0, 122, 255, 0.22) 100%)'
            }}
          >
            {/* Ultra-fine leading laser edge */}
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#007AFF] to-transparent shadow-[0_0_14px_rgba(0,122,255,0.85)]" />
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
          </motion.div>

          {/* Minimal momentary screen corner HUD calibration pulse */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="absolute inset-0 border border-[#007AFF]/30 pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
