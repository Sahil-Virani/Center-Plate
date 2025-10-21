import userRoutes from './userRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import midpointRoutes from './midpointRoutes.js';

const constructorMethod = (app) => {
    app.use('/api/midpoint', midpointRoutes);
    app.use('/api/sessions', sessionRoutes);
    app.use('/api/users', userRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Route Not found' });
    });
}

export default constructorMethod;