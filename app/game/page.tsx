'use client';

import CalendarBreakoutGame from '@/components/CalendarBreakoutGame';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom color="error">
        Oops! Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {error.message}
      </Typography>
      <Button
        variant="contained"
        startIcon={<RestartAltIcon />}
        onClick={resetErrorBoundary}
      >
        Reset Game
      </Button>
    </Box>
  );
}

export default function GamePage() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <CalendarBreakoutGame />
    </ErrorBoundary>
  );
}