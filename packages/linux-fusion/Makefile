KERNEL_VERSION   = _LINUX_VERSION_
ROOT_BUILD       = _ROOTBUILD_
KERNEL_MODLIB    = _LINUX_DIR_
KERNEL_BUILD     = $(KERNEL_MODLIB)/
KERNEL_SOURCE    = $(KERNEL_MODLIB)/
KDESTDIR         = _SYSROOT_

KERNEL_PATCHLEVEL = $(shell echo $(KERNEL_VERSION) | cut -d . -f 2)
KERNEL_PATCHLEVEL = $(shell echo $(KERNEL_VERSION) | cut -d . -f 2)
#KERNEL_PATCHLEVEL = $(shell grep 'PATCHLEVEL =' $(KERNEL_BUILD)/Makefile | cut -d ' ' -f 3)

SUB = linux/drivers/char/fusion

export CONFIG_FUSION_DEVICE=m


ifeq ($(DEBUG),yes)
  CPPFLAGS += -DFUSION_DEBUG_SKIRMISH_DEADLOCK
endif

ifeq ($(shell test -e $(KERNEL_BUILD)/include/linux/autoconf.h && echo yes),yes)
  AUTOCONF_H = -include $(KERNEL_BUILD)/include/linux/autoconf.h
endif

ifeq ($(shell test -e $(KERNEL_BUILD)/include/linux/config.h && echo yes),yes)
  CPPFLAGS += -DHAVE_LINUX_CONFIG_H
endif

.PHONY: all install clean

all:
	rm -f $(SUB)/Makefile
	ln -s Makefile-2.$(KERNEL_PATCHLEVEL) $(SUB)/Makefile
	$(MAKE) ARCH=_TARGET_ARCH_ CROSS_COMPILE=$(ROOT_BUILD)/toolchain/bin/_TARGET_NAME_- -C $(KERNEL_BUILD) \
		CPPFLAGS="$(CPPFLAGS) -D__KERNEL__ -I`pwd`/linux/include -I$(KERNEL_BUILD)/include -I$(KERNEL_SOURCE)/include $(AUTOCONF_H)" \
		SUBDIRS=`pwd`/$(SUB) modules

install: all
	install -d $(DESTDIR)/usr/include/linux
	install -m 644 linux/include/linux/fusion.h $(DESTDIR)/usr/include/linux

	install -d $(DESTDIR)$(KERNEL_MODLIB)/drivers/char/fusion

ifeq ($(KERNEL_PATCHLEVEL),4)
	install -m 644 $(SUB)/fusion.o $(DESTDIR)$(KERNEL_MODLIB)/drivers/char/fusion
	rm -f $(DESTDIR)$(KERNEL_MODLIB)/fusion.o
else
	install -m 644 $(SUB)/fusion.ko $(DESTDIR)$(KERNEL_MODLIB)/drivers/char/fusion
	rm -f $(DESTDIR)$(KERNEL_MODLIB)/fusion.ko
endif
ifneq ($(strip $(DESTDIR)),)
	/sbin/depmod -ae -b $(DESTDIR) $(KERNEL_VERSION)
else
	/sbin/depmod -ae $(KERNEL_VERSION)
endif



clean:
	find $(SUB) -name *.o -o -name *.ko -o -name .*.o.cmd -o \
		-name fusion.mod.* -o -name .fusion.* | xargs rm -f
	rm -f $(SUB)/Makefile
