export class SummaryReport {
    constructor(
        location = [],
        cartridges = [],
        ews = [],
        missiles = [],
        completion = [],
    ) {
        this.location = location
        this.cartridges = cartridges
        this.ews = ews
        this.missiles = missiles
        this.completion = completion
    }
}
