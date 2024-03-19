<?php namespace Joomla\Plugin\System\LazyLoadPagination\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\CMSPlugin;

class LazyLoadPagination extends CMSPlugin
{

	public function onBeforeRender()
	{
		$wa = Factory::getApplication()->getDocument()->getWebAssetManager();

		$wa->addInlineScript(<<<EOF
window.LazyLoadPaginationConfig = {
	target_pagination: '{$this->params->get('target_pagination')}',
	target_li: '{$this->params->get('target_li')}',
	target_active: '{$this->params->get('target_active')}',
	target_content: '{$this->params->get('target_content')}'
};
EOF
		);

		$assetsRegistry = $wa->getRegistry();
		$assetsRegistry->addExtensionRegistryFile('plg_system_lazyloadpagination');
		$wa->useScript('plg_system_lazyloadpagination.lazyloadpagination');
	}

}