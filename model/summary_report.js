export class SummaryReport {
    constructor(
        cartridges = [],
        ews = [],
        missiles = []
    ) {
        this.cartridges = cartridges
        this.ews = ews
        this.missiles = missiles
    }
}
