import pool from "../../../shared/db/postgres"; 

export const createWholesaler = async(wholesalerData) => {
    const { name, email, phone, address } = wholesalerData;
   const result = await pool.query(
  `
  INSERT INTO wholesalers (
    business_name,
    business_category_id,
    owner_name,
    phone_number,
    alternate_phone_number,
    email,
    website_url,
    business_address,
    billing_address,
    gst_number,
    pan_number,
    aadhar_number,
    years_in_business,
    number_of_employees,
    annual_turnover,
    trade_license_number,
    status,
    created_by_id,
    created_by_role,
    verified_by_id,
    verified_by_role
  )
  VALUES (
    $1,  $2,  $3,  $4,  $5,
    $6,  $7,  $8,  $9,  $10,
    $11, $12, $13, $14, $15,
    $16, 'verified', $17, 'admin', $17, 'admin'
  )
  RETURNING *
  `,
  [
    businessName,            // $1
    businessCategoryId,      // $2
    ownerName,               // $3
    phoneNumber,             // $4
    alternatePhoneNumber,    // $5
    email,                   // $6
    websiteUrl,              // $7
    businessAddress,         // $8
    billingAddress,          // $9
    gstNumber,               // $10
    panNumber,               // $11
    aadharNumber,            // $12
    yearsInBusiness,         // $13
    numberOfEmployees,       // $14
    annualTurnover,          // $15
    tradeLicenseNumber,      // $16
    adminId                  // $17
  ]
);


    return result.rows[0];
};