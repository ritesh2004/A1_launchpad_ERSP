export const validateInput = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                errors: result.error.flatten().fieldErrors
            });
        }
        next();
    };
};
