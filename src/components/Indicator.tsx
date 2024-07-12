import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface Config {
    title?: string;
    subtitle?: string;
    value: number;
}

export default function Indicator({ title, subtitle, value }: Config) {
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                {title}
            </Typography>
            <Typography component="p" variant="h4">
                {value}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                {subtitle}
            </Typography>
        </Paper>
    )
}
