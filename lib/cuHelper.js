var cuHelper = {};

cuHelper.maxSize = 16;
cuHelper.monthlyHours = 750;

// AWS sizes
cuHelper.aws = {};
cuHelper.aws['c1.medium'] = {ram: 1.7, cpu: 2};
cuHelper.aws['c1.xlarge'] = {ram: 7, cpu: 8};
cuHelper.aws['c3.2xlarge'] = {ram: 15, cpu: 8};
cuHelper.aws['c3.4xlarge'] = {ram: 30, cpu: 16};
cuHelper.aws['c3.8xlarge'] = {ram: 60, cpu: 32};
cuHelper.aws['c3.large'] = {ram: 3.75, cpu: 2};
cuHelper.aws['c3.xlarge'] = {ram: 7.5, cpu: 4};
cuHelper.aws['c4.2xlarge'] = {ram: 15, cpu: 8};
cuHelper.aws['c4.4xlarge'] = {ram: 30, cpu: 16};
cuHelper.aws['c4.8xlarge'] = {ram: 60, cpu: 36};
cuHelper.aws['c4.large'] = {ram: 3.75, cpu: 2};
cuHelper.aws['c4.xlarge'] = {ram: 7.5, cpu: 4};
cuHelper.aws['cc2.8xlarge'] = {ram: 60.5, cpu: 32};
cuHelper.aws['cg1.4xlarge'] = {ram: 22.5, cpu: 16};
cuHelper.aws['cr1.8xlarge'] = {ram: 244, cpu: 32};
cuHelper.aws['d2.2xlarge'] = {ram: 61, cpu: 8};
cuHelper.aws['d2.4xlarge'] = {ram: 122, cpu: 16};
cuHelper.aws['d2.8xlarge'] = {ram: 244, cpu: 36};
cuHelper.aws['d2.xlarge'] = {ram: 30.5, cpu: 4};
cuHelper.aws['g2.2xlarge'] = {ram: 15, cpu: 8};
cuHelper.aws['g2.8xlarge'] = {ram: 60, cpu: 32};
cuHelper.aws['hi1.4xlarge'] = {ram: 60.5, cpu: 16};
cuHelper.aws['hs1.8xlarge'] = {ram: 117, cpu: 16};
cuHelper.aws['i2.2xlarge'] = {ram: 61, cpu: 8};
cuHelper.aws['i2.4xlarge'] = {ram: 122, cpu: 16};
cuHelper.aws['i2.8xlarge'] = {ram: 244, cpu: 32};
cuHelper.aws['i2.xlarge'] = {ram: 30.5, cpu: 4};
cuHelper.aws['m1.large'] = {ram: 7.5, cpu: 2};
cuHelper.aws['m1.medium'] = {ram: 3.75, cpu: 1};
cuHelper.aws['m1.small'] = {ram: 1.7, cpu: 1};
cuHelper.aws['m1.xlarge'] = {ram: 15, cpu: 4};
cuHelper.aws['m2.2xlarge'] = {ram: 34.2, cpu: 4};
cuHelper.aws['m2.4xlarge'] = {ram: 68.4, cpu: 8};
cuHelper.aws['m2.xlarge'] = {ram: 17.1, cpu: 2};
cuHelper.aws['m3.2xlarge'] = {ram: 30, cpu: 8};
cuHelper.aws['m3.large'] = {ram: 7.5, cpu: 2};
cuHelper.aws['m3.medium'] = {ram: 3.75, cpu: 1};
cuHelper.aws['m3.xlarge'] = {ram: 15, cpu: 4};
cuHelper.aws['m4.10xlarge'] = {ram: 160, cpu: 40};
cuHelper.aws['m4.2xlarge'] = {ram: 32, cpu: 8};
cuHelper.aws['m4.4xlarge'] = {ram: 64, cpu: 16};
cuHelper.aws['m4.large'] = {ram: 8, cpu: 2};
cuHelper.aws['m4.xlarge'] = {ram: 16, cpu: 4};
cuHelper.aws['r3.2xlarge'] = {ram: 61, cpu: 8};
cuHelper.aws['r3.4xlarge'] = {ram: 122, cpu: 16};
cuHelper.aws['r3.8xlarge'] = {ram: 244, cpu: 32};
cuHelper.aws['r3.large'] = {ram: 15.25, cpu: 2};
cuHelper.aws['r3.xlarge'] = {ram: 30.5, cpu: 4};
cuHelper.aws['t1.micro'] = {ram: 0.613, cpu: 1};
cuHelper.aws['t2.large'] = {ram: 8, cpu: 2};
cuHelper.aws['t2.medium'] = {ram: 4, cpu: 2};
cuHelper.aws['t2.micro'] = {ram: 1, cpu: 1};
cuHelper.aws['t2.nano'] = {ram: 0.5, cpu: 1};
cuHelper.aws['t2.small'] = {ram: 2, cpu: 1};
cuHelper.aws['db.cr1.8xl'] = {ram: 244, cpu: 32};
cuHelper.aws['db.t1.micro'] = {ram: 0.613, cpu: 1};
cuHelper.aws['db.t2.small'] = {ram: 2, cpu: 1};
cuHelper.aws['db.t2.micro'] = {ram: 1, cpu: 1};
cuHelper.aws['db.m1.small'] = {ram: 1.7, cpu: 1};
cuHelper.aws['db.t2.medium'] = {ram: 4, cpu: 2};
cuHelper.aws['db.m1.medium'] = {ram: 3.75, cpu: 1};
cuHelper.aws['db.t2.large'] = {ram: 8, cpu: 2};
cuHelper.aws['db.m4.large'] = {ram: 8, cpu: 2};
cuHelper.aws['db.m3.large'] = {ram: 7.5, cpu: 2};
cuHelper.aws['db.m3.medium'] = {ram: 3.75, cpu: 1};
cuHelper.aws['db.m1.large'] = {ram: 7.5, cpu: 2};
cuHelper.aws['db.r3.large'] = {ram: 15.25, cpu: 2};
cuHelper.aws['db.m2.xlarge'] = {ram: 17.1, cpu: 2};
cuHelper.aws['db.m3.xlarge'] = {ram: 15, cpu: 4};
cuHelper.aws['db.r3.xlarge'] = {ram: 30.5, cpu: 4};
cuHelper.aws['db.m2.2xlarge'] = {ram: 34.2, cpu: 4};
cuHelper.aws['db.m4.2xlarge'] = {ram: 32, cpu: 8};
cuHelper.aws['db.m4.xlarge'] = {ram: 16, cpu: 4};
cuHelper.aws['db.m1.xlarge'] = {ram: 15, cpu: 4};
cuHelper.aws['db.r3.2xlarge'] = {ram: 61, cpu: 8};
cuHelper.aws['db.m2.4xlarge'] = {ram: 68.4, cpu: 8};
cuHelper.aws['db.m3.2xlarge'] = {ram: 30, cpu: 8};
cuHelper.aws['db.r3.4xlarge'] = {ram: 122, cpu: 16};
cuHelper.aws['db.m4.10xlarge'] = {ram: 160, cpu: 40};
cuHelper.aws['db.m4.4xlarge'] = {ram: 64, cpu: 16};
cuHelper.aws['db.r3.8xlarge'] = {ram: 244, cpu: 32};


cuHelper.getComputeUnits = function getCU(cloud, instanceType) {
  // Default to the max size
  var cuSize = cuHelper.maxSize;

  if (cloud == 'AWS') {
    var sz = cuHelper.aws[instanceType]
    if (sz != null) {
      cuSize = sz.ram + sz.cpu;
    }
  }
  return Math.min(cuSize, cuHelper.maxSize);
}

module.exports = cuHelper;