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
    USER_SIGNUP:"USER_SIGNUP", // for user login and singup 
    USERS_OTP:"USERS_OTP",     //  for  users otp service 
}

export default Object.freeze(constants)  