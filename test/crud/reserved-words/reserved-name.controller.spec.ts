describe('ReservedNameController', () => {
    it('should be do not use reserved name on controller', async () => {
        try {
            /** ESM has no require(); the reserved-word check fires while the module is evaluated */
            const { ReservedNameController } = await import('./reserved-name.controller.js');
            new ReservedNameController({} as never);
            throw new Error('fail');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            if (error instanceof Error) {
                expect(error.message).toBe('reservedReadOne is a reserved word. cannot use');
            }
        }
    });
});
