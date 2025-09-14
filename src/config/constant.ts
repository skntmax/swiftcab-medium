const constants = {
    cache_time: 7200, // 2 hrs in secods
    quizCacheTime:36000, 
    notification_cache_clear:60 
     
}

export const userRoles = {
    superAdmin: "super-admin",
    admin: "admin",
    salesManager: "sales-manager",
    salesExecutive: "sales-executive",
    salesRepresentative: "sales-representative",
    accountManager: "account-manager",
    marketingManager: "marketing-manager",
    marketingExecutive: "marketing-executive",
    marketingSpecialist: "marketing-specialist",
    customerSupportManager: "customer support-manager",
    supportAgent: "support-agent",
    helpdeskAgent: "helpdesk-agent",
    technicalSupportEngineer: "technical support-engineer",
    operationsManager: "operations-manager",
    financeManager: "finance-manager",
    crmDeveloper: "crm-developer",
    crmAnalyst: "crm-analyst",
    partnerManager: "partner-manager",
    vendorCoordinator: "vendor-coordinator",
    customer: "customer",
    owner: "owner",
    driverPartner:"driver-partner"

}


export const REDIS_KEYS  = {
    USER_ROLE:"USER_ROLE",
    GET_COUNTRIES:"GET_COUNTRIES",
    GET_STATES:"GET_STATES",
    GET_CITY:"GET_CITY",
    GET_LOCALITY:"GET_LOCALITY",
    ALL_ROLES:"ALL_ROLES",
    VHICLE_TYPE:"VHICLE_TYPE",
    BANKS:"BANKS",
    BANK_BRANCHES:"BANK_BRANCHES"

}


export const REDIS_QUEUES  = {
    DRIVER_ACCEPTED_RIDES:"DRIVER_ACCEPTED_RIDES", // drivers who have accepted rides 
    VARIFY_OTP:"VARIFY_OTP", // customer or user who is willing to intiated ride  
}


export const GOE_HASH_KEYS = {
    NOIDA_GEO_HASH:"driver:location:noida:geo", // for driver location
}

export const CONSOLE_COLORS = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  FgGray: "\x1b[90m",
  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
  BgGray: "\x1b[100m",
  
}


export default Object.freeze(constants)  