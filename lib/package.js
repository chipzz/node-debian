"use strict";

function Package()
{
}

var re_valid_version = /^(?:(\d+):)?([A-Za-z0-9.+:~-]+?)(?:-([A-Za-z0-9+.~]+))?$/
function Version(version)
{
	var match = re_valid_version.exec(version)
	if (!match)
		throw new Exception();
	this._full_version = match[0]
	this._epoch = match[1] || '0'
	this._upstream_version = match[2]
	this._debian_revision = match[3]
}

function cmp(a, b)
{
	return a == b ? 0 : (a < b ? -1 : 1)
}

var re_digits = /\d+/
var re_alpha = /[A-Za-z]/
function order(c)
{
	if (c == '~')
		return -1
	if (c.match(re_digits))
		return parseInt(c, 10) + 1
	if (c.match(re_alpha))
		return c.charCodeAt()
	return c.charCodeAt() + 256
}

function cmp_version_string(va, vb)
{
	var la = va.split('').map(order),
	    lb = vb.split('').map(order)
	while (la.length || lb.length)
	{
		var a = la.length ? la.shift() : 0,
		    b = lb.length ? lb.shift() : 0
		var oc = cmp(a, b)
		if (oc)
			return oc
	}
	return 0
}

var re_all_digits_or_not = /\d+|\D+/g
function cmp_version_part(va, vb)
{
	var la = va.match(re_all_digits_or_not),
	    lb = vb.match(re_all_digits_or_not)
	while (la.length && lb.length)
	{
		var a = la.length ? la.shift() : '0',
		    b = lb.length ? lb.shift() : '0'
		if (a.match(re_digits) && b.match(re_digits))
		{
			a = parseInt(a, 10)
			b = parseInt(b, 10)
			var ic = cmp(a, b)
			if (ic)
				return ic
		}
		else
		{
			var sc = cmp_version_string(a, b)
			if (sc)
				return sc
		}
	}
	return 0
}

Version.prototype.cmp = function(other)
{
	var me = parseInt(this._epoch, 10)
	var oe = parseInt(other._epoch, 10)
	if (me != oe)
		return cmp(me, oe)
	var uc = cmp_version_part(this._upstream_version, other._upstream_version)
	if (uc)
		return uc
	return cmp_version_part(this._debian_revision || '0', other._debian_revision || '0')
}

Package.Version = Version

module.exports = Package
